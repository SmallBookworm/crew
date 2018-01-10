import {Mata, MataArray} from './mata'

class MataPool {
    constructor(max) {
        this._continue = true;
        this._waitingPool = new MataArray();
        this._doingPool = new MataArray();
        this._failPool = new MataArray();
        this._finishPool = new MataArray();
        this._usedPool = new MataArray();
        this._amount = 0;
        this.max = max;
        this.endFunction = null;
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
    }

    /**
     * @param {function}value
     * @param {function}bundle
     * */
    push(value, bundle) {
        this._waitingPool.push(new Mata(this._amount, value, bundle));
        this._amount++;
    }

    get(id) {
        let mata = this._finishPool._valueOfId(id);
        if (mata) {
            this._finishPool.remove(mata);
            this._usedPool.push(mata);
            return mata;
        }
        else
            return this._failPool._valueOfId(id);
    }

    getUsed(id) {
        return this._usedPool._valueOfId(id);
    }

    start() {
        while (this._continue && this._waitingPool.length && (this.max > this._doingPool.length)) {
            let mata = this._waitingPool.pop();
            mata.getPromise().then(this.resolve(mata), this.reject(mata));
            this._doingPool.push(mata);
            mata.do();
        }
    }

    eventListen() {
        if (this._waitingPool.length === 0 && this._doingPool.length === 0 && this.endFunction)
            this.endFunction();
    }

    stop() {
        this._continue = false;
    }

    continue() {
        this._continue = true;
        this.start();
    }

    resolve(mata) {
        return (res) => {
            this._doingPool.remove(mata);
            this._finishPool.push(mata);
            mata.finish(res);
            console.log('%c' + this.show(), 'color:#00ff00');
            this.start();
            this.eventListen();
        }
    }

    reject(mata) {
        return (error) => {
            this._doingPool.remove(mata);
            this._failPool.push(mata);
            mata.fail(error);
            console.log('%c' + this.show(), 'color:ff0000');
            this.start();
            this.eventListen();
        }
    }

    show() {
        return 'finish:' + this._finishPool.length + ' used:' + this._usedPool.length +
            ' fail:' + this._failPool.length + ' waiting:' + this._waitingPool.length +
            ' doing:' + this._doingPool.length;
    }
}

export default MataPool;