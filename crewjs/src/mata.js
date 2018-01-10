const WAIT = 0;
const DOING = 1;
const FINISH = 2;
const FAIL = 3;

class Mata {
    constructor(id, func, bundle) {
        this.id = id;
        this.getPromise = func;
        this.bundle = bundle;
        this.state = WAIT;
        this.data = null;
        this.error = null;
    }

    do() {
        this.state = DOING;
    }

    fail(error) {
        this.error = error;
        this.state = FAIL;
        this.bundle(this.id)
    }

    finish(res) {
        this.data = res;
        this.state = FINISH;
        this.bundle(this.id)
    }
}

class MataArray {
    constructor(...matas) {
        this._reqar = [];
        if (matas)
            this.push(...matas);
    }

    push(...matas) {
        let failAmount = 0;
        matas.forEach(function (mata) {
            if (!this._valueOfId(mata))
                this._reqar.push(mata);
            else
                failAmount++;
        }, this);
        return failAmount;
    }

    pop() {
        return this._reqar.pop();
    }

    remove(mata) {
        return this._reqar.splice(this._reqar.indexOf(mata), 1);
    }

    _valueOfId(id) {
        for (let mata of this._reqar) {
            if (mata.id === id)
                return mata;
        }
    }

    get length() {
        return this._reqar.length;
    }

}

export {Mata, MataArray, WAIT, DOING, FINISH, FAIL}