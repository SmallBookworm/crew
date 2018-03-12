class Listener {
    constructor(mataPool) {
        this._mataPool = mataPool;
    }

    setEndFunction(func){
        if (this._waitingPool.length === 0 && this._doingPool.length === 0 && this.endFunction)
            this.endFunction();
    }
    setStartFunction(){
        if (this._waitingPool.length === 0 && this._doingPool.length === 0 && this.endFunction)
            this.endFunction();
    }
}

export default Listener;