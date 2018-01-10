import MataPool from './src/scheduler'
import downloadMoudle from './lib/downloadMoudle'
import {WAIT, DOING, FINISH, FAIL} from './src/mata'

class Scheduler {
    constructor(max) {
        this.pool = new MataPool(max);
        this._init = false;
    }

    init(pFunc, fFunc) {
        if (!this._init) {
            if (pFunc && fFunc) {
                this.pool.push(pFunc, fFunc);
                this._init = true;
            }
            else
                throw new Error('Please give two functions')
        } else
            throw new Error('Init already');
    }

    push(pFunc, fFunc) {
        if (pFunc && fFunc)
            this.pool.push(pFunc, fFunc);
    }

    setEndFunction(func) {
        this.pool.endFunction = func;
    }

    start() {
        this.pool.start();
    }

    continue() {
        this.pool.continue();
    }

    stop() {
        this.pool.stop();
    }

    getMata(id, used) {
        if (used)
            return this.pool.getUsed(id);
        else
            return this.pool.get(id);
    }
}

const MataState = {WAIT: WAIT, DOING: DOING, FINISH: FINISH, FAIL: FAIL};
export {downloadMoudle, Scheduler, MataState}