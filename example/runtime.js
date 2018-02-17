/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return Mata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return MataArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return WAIT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DOING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return FINISH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return FAIL; });
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



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crewjs__ = __webpack_require__(2);


let scheduler = new __WEBPACK_IMPORTED_MODULE_0_crewjs__["b" /* Scheduler */](33);

function createPromise() {
    let url="https://github.com/";
    let xhr = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        //method，address，async
        xhr.open('GET', url, true);
        xhr.responseType = "document";

        xhr.onload = function () {
            if (xhr.status === 200) {
                //attention:it is not responseText
                let doc = xhr.response;
                if (doc) {
                    resolve(doc);
                } else {
                    reject("parser document faily");
                }
            } else {
                reject("status!=200");
            }
        };
        xhr.onerror = function (e) {
            reject(e);
        };
        xhr.send();
    })
}
scheduler.init(createPromise,function (id) {
    let mata=scheduler.getMata(id);
    if(mata.state===__WEBPACK_IMPORTED_MODULE_0_crewjs__["a" /* MataState */].FINISH){
        console.log(mata.data);
    }else {
        console.log('fail');
    }
});
scheduler.start();

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Scheduler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MataState; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_scheduler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_downloadMoudle__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_mata__ = __webpack_require__(0);
/* unused harmony reexport downloadMoudle */




class Scheduler {
    constructor(max) {
        this.pool = new __WEBPACK_IMPORTED_MODULE_0__src_scheduler__["a" /* default */](max);
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

const MataState = {WAIT: __WEBPACK_IMPORTED_MODULE_2__src_mata__["f" /* WAIT */], DOING: __WEBPACK_IMPORTED_MODULE_2__src_mata__["a" /* DOING */], FINISH: __WEBPACK_IMPORTED_MODULE_2__src_mata__["c" /* FINISH */], FAIL: __WEBPACK_IMPORTED_MODULE_2__src_mata__["b" /* FAIL */]};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mata__ = __webpack_require__(0);


class MataPool {
    constructor(max) {
        this._continue = true;
        this._waitingPool = new __WEBPACK_IMPORTED_MODULE_0__mata__["e" /* MataArray */]();
        this._doingPool = new __WEBPACK_IMPORTED_MODULE_0__mata__["e" /* MataArray */]();
        this._failPool = new __WEBPACK_IMPORTED_MODULE_0__mata__["e" /* MataArray */]();
        this._finishPool = new __WEBPACK_IMPORTED_MODULE_0__mata__["e" /* MataArray */]();
        this._usedPool = new __WEBPACK_IMPORTED_MODULE_0__mata__["e" /* MataArray */]();
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
        this._waitingPool.push(new __WEBPACK_IMPORTED_MODULE_0__mata__["d" /* Mata */](this._amount, value, bundle));
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

    //make mata to do
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

/* harmony default export */ __webpack_exports__["a"] = (MataPool);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__res_tpl__ = __webpack_require__(5);

let downloadMoudle = {};
downloadMoudle.head=__WEBPACK_IMPORTED_MODULE_0__res_tpl__["a" /* default */];
downloadMoudle.createTable = function (json) {
    let ctable = document.createElement('table');
    ctable.innerHTML = '';
    downloadMoudle._initTable(json, ctable);

    for (let i in json) {
        let tr = document.createElement('tr');
        for (let j in json[i]) {
            let td = document.createElement('td');
            td.textContent = json[i][j];
            //			td.style.width = '100px';
            tr.appendChild(td);
        }
        ctable.appendChild(tr);
    }
    return ctable;
};
downloadMoudle._initTable = function (json, ctable) {
    let thr = document.createElement('tr');
    for (let i in json[0]) {
        let th = document.createElement('th');
        th.textContent = i;
        thr.appendChild(th);
    }
    ctable.appendChild(thr);
};

downloadMoudle.downloadFile = function (fileName, content) {
    let aLink = document.createElement('a');
    let blob = new Blob([content]);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
};
/* unused harmony default export */ var _unused_webpack_default_export = (downloadMoudle);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let head = ['<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">',
    ' <head>',
    '  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>',
    '  <meta name="ProgId" content="Excel.Sheet"/>',
    '  <meta name="Generator" content="WPS Office ET"/>',
    '  <!--[if gte mso 9]>',
    '   <xml>',
    '    <o:DocumentProperties>',
    '     <o:Created>2017-08-01T14:50:16</o:Created>',
    '     <o:LastAuthor>peng</o:LastAuthor>',
    '     <o:LastSaved>2017-08-01T15:11:54</o:LastSaved>',
    '    </o:DocumentProperties>',
    '    <o:CustomDocumentProperties>',
    '     <o:KSOProductBuildVer dt:dt="string">2052-10.1.0.6690</o:KSOProductBuildVer>',
    '    </o:CustomDocumentProperties>',
    '   </xml>',
    '  <![endif]-->',
    '  <!--[if gte mso 9]>',
    '   <xml>',
    '    <x:ExcelWorkbook>',
    '     <x:ExcelWorksheets>',
    '      <x:ExcelWorksheet>',
    '       <x:Name>ok (1)</x:Name>',
    '       <x:WorksheetOptions>',
    '        <x:DefaultRowHeight>270</x:DefaultRowHeight>',
    '        <x:Selected/>',
    '        <x:Panes>',
    '         <x:Pane>',
    '          <x:Number>3</x:Number>',
    '          <x:ActiveCol>3</x:ActiveCol>',
    '          <x:ActiveRow>6</x:ActiveRow>',
    '          <x:RangeSelection>D7</x:RangeSelection>',
    '         </x:Pane>',
    '        </x:Panes>',
    '        <x:DoNotDisplayGridlines/>',
    '        <x:ProtectContents>False</x:ProtectContents>',
    '        <x:ProtectObjects>False</x:ProtectObjects>',
    '        <x:ProtectScenarios>False</x:ProtectScenarios>',
    '        <x:Print>',
    '         <x:PaperSizeIndex>9</x:PaperSizeIndex>',
    '        </x:Print>',
    '       </x:WorksheetOptions>',
    '      </x:ExcelWorksheet>',
    '     </x:ExcelWorksheets>',
    '     <x:ProtectStructure>False</x:ProtectStructure>',
    '     <x:ProtectWindows>False</x:ProtectWindows>',
    '     <x:WindowHeight>13050</x:WindowHeight>',
    '     <x:WindowWidth>28695</x:WindowWidth>',
    '    </x:ExcelWorkbook>',
    '   </xml>',
    '  <![endif]-->',
    ' </head>'
].join("");
/* harmony default export */ __webpack_exports__["a"] = (head);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2E4ZjFmMDRjNjQyN2M0NDZjY2QiLCJ3ZWJwYWNrOi8vLy4uL2NyZXdqcy9zcmMvbWF0YS5qcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi4vY3Jld2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uLi9jcmV3anMvc3JjL3NjaGVkdWxlci5qcyIsIndlYnBhY2s6Ly8vLi4vY3Jld2pzL2xpYi9kb3dubG9hZE1vdWRsZS5qcyIsIndlYnBhY2s6Ly8vLi4vY3Jld2pzL3Jlcy90cGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDN0RBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDckU2Qzs7QUFFN0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNELGtCOzs7Ozs7Ozs7Ozs7O0FDdkNBO0FBQ0E7QUFDa0M7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUI7Ozs7Ozs7OztBQ25ESzs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsU0FBUztBQUN4QixlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUU7Ozs7Ozs7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdGOzs7Ozs7O0FDckNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEIiwiZmlsZSI6InJ1bnRpbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzYThmMWYwNGM2NDI3YzQ0NmNjZCIsImNvbnN0IFdBSVQgPSAwO1xuY29uc3QgRE9JTkcgPSAxO1xuY29uc3QgRklOSVNIID0gMjtcbmNvbnN0IEZBSUwgPSAzO1xuXG5jbGFzcyBNYXRhIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgZnVuYywgYnVuZGxlKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5nZXRQcm9taXNlID0gZnVuYztcbiAgICAgICAgdGhpcy5idW5kbGUgPSBidW5kbGU7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBXQUlUO1xuICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xuICAgICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB9XG5cbiAgICBkbygpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IERPSU5HO1xuICAgIH1cblxuICAgIGZhaWwoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLnN0YXRlID0gRkFJTDtcbiAgICAgICAgdGhpcy5idW5kbGUodGhpcy5pZClcbiAgICB9XG5cbiAgICBmaW5pc2gocmVzKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHJlcztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IEZJTklTSDtcbiAgICAgICAgdGhpcy5idW5kbGUodGhpcy5pZClcbiAgICB9XG59XG5cbmNsYXNzIE1hdGFBcnJheSB7XG4gICAgY29uc3RydWN0b3IoLi4ubWF0YXMpIHtcbiAgICAgICAgdGhpcy5fcmVxYXIgPSBbXTtcbiAgICAgICAgaWYgKG1hdGFzKVxuICAgICAgICAgICAgdGhpcy5wdXNoKC4uLm1hdGFzKTtcbiAgICB9XG5cbiAgICBwdXNoKC4uLm1hdGFzKSB7XG4gICAgICAgIGxldCBmYWlsQW1vdW50ID0gMDtcbiAgICAgICAgbWF0YXMuZm9yRWFjaChmdW5jdGlvbiAobWF0YSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92YWx1ZU9mSWQobWF0YSkpXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVxYXIucHVzaChtYXRhKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBmYWlsQW1vdW50Kys7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFpbEFtb3VudDtcbiAgICB9XG5cbiAgICBwb3AoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXFhci5wb3AoKTtcbiAgICB9XG5cbiAgICByZW1vdmUobWF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVxYXIuc3BsaWNlKHRoaXMuX3JlcWFyLmluZGV4T2YobWF0YSksIDEpO1xuICAgIH1cblxuICAgIF92YWx1ZU9mSWQoaWQpIHtcbiAgICAgICAgZm9yIChsZXQgbWF0YSBvZiB0aGlzLl9yZXFhcikge1xuICAgICAgICAgICAgaWYgKG1hdGEuaWQgPT09IGlkKVxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcWFyLmxlbmd0aDtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHtNYXRhLCBNYXRhQXJyYXksIFdBSVQsIERPSU5HLCBGSU5JU0gsIEZBSUx9XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vY3Jld2pzL3NyYy9tYXRhLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7U2NoZWR1bGVyLCBkb3dubG9hZE1vdWRsZSwgTWF0YVN0YXRlfSBmcm9tICdjcmV3anMnXG5cbmxldCBzY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKDMzKTtcblxuZnVuY3Rpb24gY3JlYXRlUHJvbWlzZSgpIHtcbiAgICBsZXQgdXJsPVwiaHR0cHM6Ly9naXRodWIuY29tL1wiO1xuICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAvL21ldGhvZO+8jGFkZHJlc3PvvIxhc3luY1xuICAgICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiZG9jdW1lbnRcIjtcblxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIC8vYXR0ZW50aW9uOml0IGlzIG5vdCByZXNwb25zZVRleHRcbiAgICAgICAgICAgICAgICBsZXQgZG9jID0geGhyLnJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChcInBhcnNlciBkb2N1bWVudCBmYWlseVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdChcInN0YXR1cyE9MjAwXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZW5kKCk7XG4gICAgfSlcbn1cbnNjaGVkdWxlci5pbml0KGNyZWF0ZVByb21pc2UsZnVuY3Rpb24gKGlkKSB7XG4gICAgbGV0IG1hdGE9c2NoZWR1bGVyLmdldE1hdGEoaWQpO1xuICAgIGlmKG1hdGEuc3RhdGU9PT1NYXRhU3RhdGUuRklOSVNIKXtcbiAgICAgICAgY29uc29sZS5sb2cobWF0YS5kYXRhKTtcbiAgICB9ZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdmYWlsJyk7XG4gICAgfVxufSk7XG5zY2hlZHVsZXIuc3RhcnQoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBNYXRhUG9vbCBmcm9tICcuL3NyYy9zY2hlZHVsZXInXG5pbXBvcnQgZG93bmxvYWRNb3VkbGUgZnJvbSAnLi9saWIvZG93bmxvYWRNb3VkbGUnXG5pbXBvcnQge1dBSVQsIERPSU5HLCBGSU5JU0gsIEZBSUx9IGZyb20gJy4vc3JjL21hdGEnXG5cbmNsYXNzIFNjaGVkdWxlciB7XG4gICAgY29uc3RydWN0b3IobWF4KSB7XG4gICAgICAgIHRoaXMucG9vbCA9IG5ldyBNYXRhUG9vbChtYXgpO1xuICAgICAgICB0aGlzLl9pbml0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdChwRnVuYywgZkZ1bmMpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0KSB7XG4gICAgICAgICAgICBpZiAocEZ1bmMgJiYgZkZ1bmMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvb2wucHVzaChwRnVuYywgZkZ1bmMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIGdpdmUgdHdvIGZ1bmN0aW9ucycpXG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbml0IGFscmVhZHknKTtcbiAgICB9XG5cbiAgICBwdXNoKHBGdW5jLCBmRnVuYykge1xuICAgICAgICBpZiAocEZ1bmMgJiYgZkZ1bmMpXG4gICAgICAgICAgICB0aGlzLnBvb2wucHVzaChwRnVuYywgZkZ1bmMpO1xuICAgIH1cblxuICAgIHNldEVuZEZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5wb29sLmVuZEZ1bmN0aW9uID0gZnVuYztcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5wb29sLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgY29udGludWUoKSB7XG4gICAgICAgIHRoaXMucG9vbC5jb250aW51ZSgpO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMucG9vbC5zdG9wKCk7XG4gICAgfVxuXG4gICAgZ2V0TWF0YShpZCwgdXNlZCkge1xuICAgICAgICBpZiAodXNlZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvb2wuZ2V0VXNlZChpZCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvb2wuZ2V0KGlkKTtcbiAgICB9XG59XG5cbmNvbnN0IE1hdGFTdGF0ZSA9IHtXQUlUOiBXQUlULCBET0lORzogRE9JTkcsIEZJTklTSDogRklOSVNILCBGQUlMOiBGQUlMfTtcbmV4cG9ydCB7ZG93bmxvYWRNb3VkbGUsIFNjaGVkdWxlciwgTWF0YVN0YXRlfVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2NyZXdqcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge01hdGEsIE1hdGFBcnJheX0gZnJvbSAnLi9tYXRhJ1xuXG5jbGFzcyBNYXRhUG9vbCB7XG4gICAgY29uc3RydWN0b3IobWF4KSB7XG4gICAgICAgIHRoaXMuX2NvbnRpbnVlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fd2FpdGluZ1Bvb2wgPSBuZXcgTWF0YUFycmF5KCk7XG4gICAgICAgIHRoaXMuX2RvaW5nUG9vbCA9IG5ldyBNYXRhQXJyYXkoKTtcbiAgICAgICAgdGhpcy5fZmFpbFBvb2wgPSBuZXcgTWF0YUFycmF5KCk7XG4gICAgICAgIHRoaXMuX2ZpbmlzaFBvb2wgPSBuZXcgTWF0YUFycmF5KCk7XG4gICAgICAgIHRoaXMuX3VzZWRQb29sID0gbmV3IE1hdGFBcnJheSgpO1xuICAgICAgICB0aGlzLl9hbW91bnQgPSAwO1xuICAgICAgICB0aGlzLm1heCA9IG1heDtcbiAgICAgICAgdGhpcy5lbmRGdW5jdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IHRoaXMucmVzb2x2ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnJlamVjdCA9IHRoaXMucmVqZWN0LmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn12YWx1ZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259YnVuZGxlXG4gICAgICogKi9cbiAgICBwdXNoKHZhbHVlLCBidW5kbGUpIHtcbiAgICAgICAgdGhpcy5fd2FpdGluZ1Bvb2wucHVzaChuZXcgTWF0YSh0aGlzLl9hbW91bnQsIHZhbHVlLCBidW5kbGUpKTtcbiAgICAgICAgdGhpcy5fYW1vdW50Kys7XG4gICAgfVxuXG4gICAgZ2V0KGlkKSB7XG4gICAgICAgIGxldCBtYXRhID0gdGhpcy5fZmluaXNoUG9vbC5fdmFsdWVPZklkKGlkKTtcbiAgICAgICAgaWYgKG1hdGEpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpbmlzaFBvb2wucmVtb3ZlKG1hdGEpO1xuICAgICAgICAgICAgdGhpcy5fdXNlZFBvb2wucHVzaChtYXRhKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mYWlsUG9vbC5fdmFsdWVPZklkKGlkKTtcbiAgICB9XG5cbiAgICBnZXRVc2VkKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VkUG9vbC5fdmFsdWVPZklkKGlkKTtcbiAgICB9XG5cbiAgICAvL21ha2UgbWF0YSB0byBkb1xuICAgIHN0YXJ0KCkge1xuICAgICAgICB3aGlsZSAodGhpcy5fY29udGludWUgJiYgdGhpcy5fd2FpdGluZ1Bvb2wubGVuZ3RoICYmICh0aGlzLm1heCA+IHRoaXMuX2RvaW5nUG9vbC5sZW5ndGgpKSB7XG4gICAgICAgICAgICBsZXQgbWF0YSA9IHRoaXMuX3dhaXRpbmdQb29sLnBvcCgpO1xuICAgICAgICAgICAgbWF0YS5nZXRQcm9taXNlKCkudGhlbih0aGlzLnJlc29sdmUobWF0YSksIHRoaXMucmVqZWN0KG1hdGEpKTtcbiAgICAgICAgICAgIHRoaXMuX2RvaW5nUG9vbC5wdXNoKG1hdGEpO1xuICAgICAgICAgICAgbWF0YS5kbygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXZlbnRMaXN0ZW4oKSB7XG4gICAgICAgIGlmICh0aGlzLl93YWl0aW5nUG9vbC5sZW5ndGggPT09IDAgJiYgdGhpcy5fZG9pbmdQb29sLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmVuZEZ1bmN0aW9uKVxuICAgICAgICAgICAgdGhpcy5lbmRGdW5jdGlvbigpO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuX2NvbnRpbnVlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29udGludWUoKSB7XG4gICAgICAgIHRoaXMuX2NvbnRpbnVlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cblxuICAgIHJlc29sdmUobWF0YSkge1xuICAgICAgICByZXR1cm4gKHJlcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZG9pbmdQb29sLnJlbW92ZShtYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX2ZpbmlzaFBvb2wucHVzaChtYXRhKTtcbiAgICAgICAgICAgIG1hdGEuZmluaXNoKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWMnICsgdGhpcy5zaG93KCksICdjb2xvcjojMDBmZjAwJyk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50TGlzdGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWplY3QobWF0YSkge1xuICAgICAgICByZXR1cm4gKGVycm9yKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9kb2luZ1Bvb2wucmVtb3ZlKG1hdGEpO1xuICAgICAgICAgICAgdGhpcy5fZmFpbFBvb2wucHVzaChtYXRhKTtcbiAgICAgICAgICAgIG1hdGEuZmFpbChlcnJvcik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWMnICsgdGhpcy5zaG93KCksICdjb2xvcjpmZjAwMDAnKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRMaXN0ZW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHJldHVybiAnZmluaXNoOicgKyB0aGlzLl9maW5pc2hQb29sLmxlbmd0aCArICcgdXNlZDonICsgdGhpcy5fdXNlZFBvb2wubGVuZ3RoICtcbiAgICAgICAgICAgICcgZmFpbDonICsgdGhpcy5fZmFpbFBvb2wubGVuZ3RoICsgJyB3YWl0aW5nOicgKyB0aGlzLl93YWl0aW5nUG9vbC5sZW5ndGggK1xuICAgICAgICAgICAgJyBkb2luZzonICsgdGhpcy5fZG9pbmdQb29sLmxlbmd0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hdGFQb29sO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2NyZXdqcy9zcmMvc2NoZWR1bGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBoZWFkIGZyb20gJy4uL3Jlcy90cGwnXG5sZXQgZG93bmxvYWRNb3VkbGUgPSB7fTtcbmRvd25sb2FkTW91ZGxlLmhlYWQ9aGVhZDtcbmRvd25sb2FkTW91ZGxlLmNyZWF0ZVRhYmxlID0gZnVuY3Rpb24gKGpzb24pIHtcbiAgICBsZXQgY3RhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcbiAgICBjdGFibGUuaW5uZXJIVE1MID0gJyc7XG4gICAgZG93bmxvYWRNb3VkbGUuX2luaXRUYWJsZShqc29uLCBjdGFibGUpO1xuXG4gICAgZm9yIChsZXQgaSBpbiBqc29uKSB7XG4gICAgICAgIGxldCB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIGZvciAobGV0IGogaW4ganNvbltpXSkge1xuICAgICAgICAgICAgbGV0IHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgICAgICAgIHRkLnRleHRDb250ZW50ID0ganNvbltpXVtqXTtcbiAgICAgICAgICAgIC8vXHRcdFx0dGQuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xuICAgICAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGQpO1xuICAgICAgICB9XG4gICAgICAgIGN0YWJsZS5hcHBlbmRDaGlsZCh0cik7XG4gICAgfVxuICAgIHJldHVybiBjdGFibGU7XG59O1xuZG93bmxvYWRNb3VkbGUuX2luaXRUYWJsZSA9IGZ1bmN0aW9uIChqc29uLCBjdGFibGUpIHtcbiAgICBsZXQgdGhyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICBmb3IgKGxldCBpIGluIGpzb25bMF0pIHtcbiAgICAgICAgbGV0IHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgdGgudGV4dENvbnRlbnQgPSBpO1xuICAgICAgICB0aHIuYXBwZW5kQ2hpbGQodGgpO1xuICAgIH1cbiAgICBjdGFibGUuYXBwZW5kQ2hpbGQodGhyKTtcbn07XG5cbmRvd25sb2FkTW91ZGxlLmRvd25sb2FkRmlsZSA9IGZ1bmN0aW9uIChmaWxlTmFtZSwgY29udGVudCkge1xuICAgIGxldCBhTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsZXQgYmxvYiA9IG5ldyBCbG9iKFtjb250ZW50XSk7XG4gICAgYUxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZTtcbiAgICBhTGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBhTGluay5jbGljaygpO1xufTtcbmV4cG9ydCBkZWZhdWx0IGRvd25sb2FkTW91ZGxlXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vY3Jld2pzL2xpYi9kb3dubG9hZE1vdWRsZS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJsZXQgaGVhZCA9IFsnPGh0bWwgeG1sbnM6dj1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206dm1sXCIgeG1sbnM6bz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOm9mZmljZVwiIHhtbG5zOng9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOm9mZmljZTpleGNlbFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLWh0bWw0MFwiPicsXG4gICAgJyA8aGVhZD4nLFxuICAgICcgIDxtZXRhIGh0dHAtZXF1aXY9XCJDb250ZW50LVR5cGVcIiBjb250ZW50PVwidGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04XCIvPicsXG4gICAgJyAgPG1ldGEgbmFtZT1cIlByb2dJZFwiIGNvbnRlbnQ9XCJFeGNlbC5TaGVldFwiLz4nLFxuICAgICcgIDxtZXRhIG5hbWU9XCJHZW5lcmF0b3JcIiBjb250ZW50PVwiV1BTIE9mZmljZSBFVFwiLz4nLFxuICAgICcgIDwhLS1baWYgZ3RlIG1zbyA5XT4nLFxuICAgICcgICA8eG1sPicsXG4gICAgJyAgICA8bzpEb2N1bWVudFByb3BlcnRpZXM+JyxcbiAgICAnICAgICA8bzpDcmVhdGVkPjIwMTctMDgtMDFUMTQ6NTA6MTY8L286Q3JlYXRlZD4nLFxuICAgICcgICAgIDxvOkxhc3RBdXRob3I+cGVuZzwvbzpMYXN0QXV0aG9yPicsXG4gICAgJyAgICAgPG86TGFzdFNhdmVkPjIwMTctMDgtMDFUMTU6MTE6NTQ8L286TGFzdFNhdmVkPicsXG4gICAgJyAgICA8L286RG9jdW1lbnRQcm9wZXJ0aWVzPicsXG4gICAgJyAgICA8bzpDdXN0b21Eb2N1bWVudFByb3BlcnRpZXM+JyxcbiAgICAnICAgICA8bzpLU09Qcm9kdWN0QnVpbGRWZXIgZHQ6ZHQ9XCJzdHJpbmdcIj4yMDUyLTEwLjEuMC42NjkwPC9vOktTT1Byb2R1Y3RCdWlsZFZlcj4nLFxuICAgICcgICAgPC9vOkN1c3RvbURvY3VtZW50UHJvcGVydGllcz4nLFxuICAgICcgICA8L3htbD4nLFxuICAgICcgIDwhW2VuZGlmXS0tPicsXG4gICAgJyAgPCEtLVtpZiBndGUgbXNvIDldPicsXG4gICAgJyAgIDx4bWw+JyxcbiAgICAnICAgIDx4OkV4Y2VsV29ya2Jvb2s+JyxcbiAgICAnICAgICA8eDpFeGNlbFdvcmtzaGVldHM+JyxcbiAgICAnICAgICAgPHg6RXhjZWxXb3Jrc2hlZXQ+JyxcbiAgICAnICAgICAgIDx4Ok5hbWU+b2sgKDEpPC94Ok5hbWU+JyxcbiAgICAnICAgICAgIDx4OldvcmtzaGVldE9wdGlvbnM+JyxcbiAgICAnICAgICAgICA8eDpEZWZhdWx0Um93SGVpZ2h0PjI3MDwveDpEZWZhdWx0Um93SGVpZ2h0PicsXG4gICAgJyAgICAgICAgPHg6U2VsZWN0ZWQvPicsXG4gICAgJyAgICAgICAgPHg6UGFuZXM+JyxcbiAgICAnICAgICAgICAgPHg6UGFuZT4nLFxuICAgICcgICAgICAgICAgPHg6TnVtYmVyPjM8L3g6TnVtYmVyPicsXG4gICAgJyAgICAgICAgICA8eDpBY3RpdmVDb2w+MzwveDpBY3RpdmVDb2w+JyxcbiAgICAnICAgICAgICAgIDx4OkFjdGl2ZVJvdz42PC94OkFjdGl2ZVJvdz4nLFxuICAgICcgICAgICAgICAgPHg6UmFuZ2VTZWxlY3Rpb24+RDc8L3g6UmFuZ2VTZWxlY3Rpb24+JyxcbiAgICAnICAgICAgICAgPC94OlBhbmU+JyxcbiAgICAnICAgICAgICA8L3g6UGFuZXM+JyxcbiAgICAnICAgICAgICA8eDpEb05vdERpc3BsYXlHcmlkbGluZXMvPicsXG4gICAgJyAgICAgICAgPHg6UHJvdGVjdENvbnRlbnRzPkZhbHNlPC94OlByb3RlY3RDb250ZW50cz4nLFxuICAgICcgICAgICAgIDx4OlByb3RlY3RPYmplY3RzPkZhbHNlPC94OlByb3RlY3RPYmplY3RzPicsXG4gICAgJyAgICAgICAgPHg6UHJvdGVjdFNjZW5hcmlvcz5GYWxzZTwveDpQcm90ZWN0U2NlbmFyaW9zPicsXG4gICAgJyAgICAgICAgPHg6UHJpbnQ+JyxcbiAgICAnICAgICAgICAgPHg6UGFwZXJTaXplSW5kZXg+OTwveDpQYXBlclNpemVJbmRleD4nLFxuICAgICcgICAgICAgIDwveDpQcmludD4nLFxuICAgICcgICAgICAgPC94OldvcmtzaGVldE9wdGlvbnM+JyxcbiAgICAnICAgICAgPC94OkV4Y2VsV29ya3NoZWV0PicsXG4gICAgJyAgICAgPC94OkV4Y2VsV29ya3NoZWV0cz4nLFxuICAgICcgICAgIDx4OlByb3RlY3RTdHJ1Y3R1cmU+RmFsc2U8L3g6UHJvdGVjdFN0cnVjdHVyZT4nLFxuICAgICcgICAgIDx4OlByb3RlY3RXaW5kb3dzPkZhbHNlPC94OlByb3RlY3RXaW5kb3dzPicsXG4gICAgJyAgICAgPHg6V2luZG93SGVpZ2h0PjEzMDUwPC94OldpbmRvd0hlaWdodD4nLFxuICAgICcgICAgIDx4OldpbmRvd1dpZHRoPjI4Njk1PC94OldpbmRvd1dpZHRoPicsXG4gICAgJyAgICA8L3g6RXhjZWxXb3JrYm9vaz4nLFxuICAgICcgICA8L3htbD4nLFxuICAgICcgIDwhW2VuZGlmXS0tPicsXG4gICAgJyA8L2hlYWQ+J1xuXS5qb2luKFwiXCIpO1xuZXhwb3J0IGRlZmF1bHQgaGVhZDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9jcmV3anMvcmVzL3RwbC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9