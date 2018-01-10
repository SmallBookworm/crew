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
window.scheduler = scheduler;

function getURL(num, yxjbz) {
    if (yxjbz)
        return 'http://gaokao.chsi.com.cn/sch/search--yxjbz-' + yxjbz + ',searchType-1,start-' + num + '.dhtml';
    else
        return 'http://gaokao.chsi.com.cn/sch/search--ss-on,searchType-1,option-qg,start-' + num + '.dhtml';
}

function factory(url) {
    /**
     * @returns {Promise}
     **/
    return function () {
        let xhr = new XMLHttpRequest();
        return new Promise(function (resolve, reject) {
            xhr.open('GET', url, true); //get请求，请求地址，是否异步
            xhr.responseType = "document";

            xhr.onload = function () {
                if (xhr.status === 200) {
                    let doc = xhr.response; // 注意:不是oReq.responseText
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
        });
    }
}

function getOtherData(tr) {
    if (tr.firstElementChild && tr.firstElementChild.firstElementChild)
        scheduler.push(function () {
            let url = tr.firstElementChild.firstElementChild.href;
            let xhr = new XMLHttpRequest();
            return new Promise(function (resolve, reject) {
                xhr.open('GET', url, true); //get请求，请求地址，是否异步
                xhr.responseType = "document";

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        let doc = xhr.response; // 注意:不是oReq.responseText
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
        }, function (id) {
            let mata = scheduler.getMata(id);
            if (mata.state === __WEBPACK_IMPORTED_MODULE_0_crewjs__["a" /* MataState */].FINISH) {
                let doc = mata.data;
                let divs = doc.getElementsByClassName('r_c_sch_attr_1');
                for (let i = 3; i < 6; i++) {
                    let td = document.createElement('td');
                    if (divs[i])
                        td.innerText = divs[i].innerText.slice(6).replace(/[\r\n]/g, "");
                    tr.appendChild(td);
                }
            } else {
                console.log('fail')
            }
        })
}

let tbody = document.createElement('tbody');
tbody.innerHTML = '<tr bgcolor="#F6FEF5" align="center" valign="middle">\n' +
    '\t    <td height="25"><strong>院校名称</strong></td>\n' +
    '\t    <td width="45"><strong>所在地</strong></td>\n' +
    '\t    <td width="140"><strong>院校隶属</strong></td>\n' +
    '\t    <td width="60"><strong>学历层次</strong></td>    \n' +
    '\t    <td><strong>办学类型</strong></td>\n' +
    '\t    <td width="60"><strong>院校类型</strong></td>\n' +
    '\t    <td><strong>通讯地址</strong></td>\n' +
    '\t    <td><strong>联系电话</strong></td>\n' +
    '\t    <td><strong>学校网址</strong></td>\n' +
    '\t    \n' +
    '\t  </tr>';
scheduler.init(factory(getURL(0, 2)), function (id) {
    let mata = scheduler.getMata(id);
    if (mata.state === __WEBPACK_IMPORTED_MODULE_0_crewjs__["a" /* MataState */].FINISH) {
        let doc = mata.data;
        let trs = doc.getElementsByTagName('table')[2].firstElementChild.children;
        let length = trs.length;
        for (let i = 0; i < length - 1; i++) {
            getOtherData(trs[1]);
            tbody.appendChild(trs[1]);
        }
    } else {
        console.log('fail')
    }
});
for (let i = 1; i < 24; i++) {
    scheduler.push(factory(getURL(i * 20, 2)), function (id) {
        let mata = scheduler.getMata(id);
        if (mata.state === __WEBPACK_IMPORTED_MODULE_0_crewjs__["a" /* MataState */].FINISH) {
            let doc = mata.data;
            let trs = doc.getElementsByTagName('table')[2].firstElementChild.children;
            let length = trs.length;
            for (let j = 0; j < length - 1; j++) {
                getOtherData(trs[1]);
                tbody.appendChild(trs[1]);
            }
        } else {
            console.log('fail')
        }
    })
}
scheduler.setEndFunction(function () {
    let table = document.createElement('table');
    table.appendChild(tbody);
    __WEBPACK_IMPORTED_MODULE_0_crewjs__["c" /* downloadMoudle */].downloadFile('ok.xls', __WEBPACK_IMPORTED_MODULE_0_crewjs__["c" /* downloadMoudle */].head + '<body><table>' + table.innerHTML + '</table></body></html>');
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
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__lib_downloadMoudle__["a"]; });




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
/* harmony default export */ __webpack_exports__["a"] = (downloadMoudle);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTY3N2FhOWY4ZDYwMWE1NGQ3YzEiLCJ3ZWJwYWNrOi8vLy4uL2NyZXdqcy9zcmMvbWF0YS5qcyIsIndlYnBhY2s6Ly8vLi9tYWluLmpzIiwid2VicGFjazovLy8uLi9jcmV3anMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2NyZXdqcy9zcmMvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uLi9jcmV3anMvbGliL2Rvd25sb2FkTW91ZGxlLmpzIiwid2VicGFjazovLy8uLi9jcmV3anMvcmVzL3RwbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNyRTZDOztBQUU3QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDOztBQUVBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixPQUFPO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixnQkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixnQkFBZ0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7Ozs7Ozs7Ozs7Ozs7QUNySUE7QUFDQTtBQUNrQzs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjs7Ozs7Ozs7O0FDbkRLOztBQUV4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUU7Ozs7Ozs7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVFOzs7Ozs7O0FDckNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEIiwiZmlsZSI6InJ1bnRpbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlNjc3YWE5ZjhkNjAxYTU0ZDdjMSIsImNvbnN0IFdBSVQgPSAwO1xuY29uc3QgRE9JTkcgPSAxO1xuY29uc3QgRklOSVNIID0gMjtcbmNvbnN0IEZBSUwgPSAzO1xuXG5jbGFzcyBNYXRhIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgZnVuYywgYnVuZGxlKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5nZXRQcm9taXNlID0gZnVuYztcbiAgICAgICAgdGhpcy5idW5kbGUgPSBidW5kbGU7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBXQUlUO1xuICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xuICAgICAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB9XG5cbiAgICBkbygpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IERPSU5HO1xuICAgIH1cblxuICAgIGZhaWwoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLnN0YXRlID0gRkFJTDtcbiAgICAgICAgdGhpcy5idW5kbGUodGhpcy5pZClcbiAgICB9XG5cbiAgICBmaW5pc2gocmVzKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHJlcztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IEZJTklTSDtcbiAgICAgICAgdGhpcy5idW5kbGUodGhpcy5pZClcbiAgICB9XG59XG5cbmNsYXNzIE1hdGFBcnJheSB7XG4gICAgY29uc3RydWN0b3IoLi4ubWF0YXMpIHtcbiAgICAgICAgdGhpcy5fcmVxYXIgPSBbXTtcbiAgICAgICAgaWYgKG1hdGFzKVxuICAgICAgICAgICAgdGhpcy5wdXNoKC4uLm1hdGFzKTtcbiAgICB9XG5cbiAgICBwdXNoKC4uLm1hdGFzKSB7XG4gICAgICAgIGxldCBmYWlsQW1vdW50ID0gMDtcbiAgICAgICAgbWF0YXMuZm9yRWFjaChmdW5jdGlvbiAobWF0YSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl92YWx1ZU9mSWQobWF0YSkpXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVxYXIucHVzaChtYXRhKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBmYWlsQW1vdW50Kys7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFpbEFtb3VudDtcbiAgICB9XG5cbiAgICBwb3AoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXFhci5wb3AoKTtcbiAgICB9XG5cbiAgICByZW1vdmUobWF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVxYXIuc3BsaWNlKHRoaXMuX3JlcWFyLmluZGV4T2YobWF0YSksIDEpO1xuICAgIH1cblxuICAgIF92YWx1ZU9mSWQoaWQpIHtcbiAgICAgICAgZm9yIChsZXQgbWF0YSBvZiB0aGlzLl9yZXFhcikge1xuICAgICAgICAgICAgaWYgKG1hdGEuaWQgPT09IGlkKVxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcWFyLmxlbmd0aDtcbiAgICB9XG5cbn1cblxuZXhwb3J0IHtNYXRhLCBNYXRhQXJyYXksIFdBSVQsIERPSU5HLCBGSU5JU0gsIEZBSUx9XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vY3Jld2pzL3NyYy9tYXRhLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7U2NoZWR1bGVyLCBkb3dubG9hZE1vdWRsZSwgTWF0YVN0YXRlfSBmcm9tICdjcmV3anMnXG5cbmxldCBzY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKDMzKTtcbndpbmRvdy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG5cbmZ1bmN0aW9uIGdldFVSTChudW0sIHl4amJ6KSB7XG4gICAgaWYgKHl4amJ6KVxuICAgICAgICByZXR1cm4gJ2h0dHA6Ly9nYW9rYW8uY2hzaS5jb20uY24vc2NoL3NlYXJjaC0teXhqYnotJyArIHl4amJ6ICsgJyxzZWFyY2hUeXBlLTEsc3RhcnQtJyArIG51bSArICcuZGh0bWwnO1xuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICdodHRwOi8vZ2Fva2FvLmNoc2kuY29tLmNuL3NjaC9zZWFyY2gtLXNzLW9uLHNlYXJjaFR5cGUtMSxvcHRpb24tcWcsc3RhcnQtJyArIG51bSArICcuZGh0bWwnO1xufVxuXG5mdW5jdGlvbiBmYWN0b3J5KHVybCkge1xuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTsgLy9nZXTor7fmsYLvvIzor7fmsYLlnLDlnYDvvIzmmK/lkKblvILmraVcbiAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBcImRvY3VtZW50XCI7XG5cbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZG9jID0geGhyLnJlc3BvbnNlOyAvLyDms6jmhI865LiN5pivb1JlcS5yZXNwb25zZVRleHRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwicGFyc2VyIGRvY3VtZW50IGZhaWx5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwic3RhdHVzIT0yMDBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRPdGhlckRhdGEodHIpIHtcbiAgICBpZiAodHIuZmlyc3RFbGVtZW50Q2hpbGQgJiYgdHIuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQpXG4gICAgICAgIHNjaGVkdWxlci5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCB1cmwgPSB0ci5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5ocmVmO1xuICAgICAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTsgLy9nZXTor7fmsYLvvIzor7fmsYLlnLDlnYDvvIzmmK/lkKblvILmraVcbiAgICAgICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJkb2N1bWVudFwiO1xuXG4gICAgICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRvYyA9IHhoci5yZXNwb25zZTsgLy8g5rOo5oSPOuS4jeaYr29SZXEucmVzcG9uc2VUZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZG9jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoXCJwYXJzZXIgZG9jdW1lbnQgZmFpbHlcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoXCJzdGF0dXMhPTIwMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSwgZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBsZXQgbWF0YSA9IHNjaGVkdWxlci5nZXRNYXRhKGlkKTtcbiAgICAgICAgICAgIGlmIChtYXRhLnN0YXRlID09PSBNYXRhU3RhdGUuRklOSVNIKSB7XG4gICAgICAgICAgICAgICAgbGV0IGRvYyA9IG1hdGEuZGF0YTtcbiAgICAgICAgICAgICAgICBsZXQgZGl2cyA9IGRvYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyX2Nfc2NoX2F0dHJfMScpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAzOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXZzW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGQuaW5uZXJUZXh0ID0gZGl2c1tpXS5pbm5lclRleHQuc2xpY2UoNikucmVwbGFjZSgvW1xcclxcbl0vZywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmYWlsJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbn1cblxubGV0IHRib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGJvZHknKTtcbnRib2R5LmlubmVySFRNTCA9ICc8dHIgYmdjb2xvcj1cIiNGNkZFRjVcIiBhbGlnbj1cImNlbnRlclwiIHZhbGlnbj1cIm1pZGRsZVwiPlxcbicgK1xuICAgICdcXHQgICAgPHRkIGhlaWdodD1cIjI1XCI+PHN0cm9uZz7pmaLmoKHlkI3np7A8L3N0cm9uZz48L3RkPlxcbicgK1xuICAgICdcXHQgICAgPHRkIHdpZHRoPVwiNDVcIj48c3Ryb25nPuaJgOWcqOWcsDwvc3Ryb25nPjwvdGQ+XFxuJyArXG4gICAgJ1xcdCAgICA8dGQgd2lkdGg9XCIxNDBcIj48c3Ryb25nPumZouagoematuWxnjwvc3Ryb25nPjwvdGQ+XFxuJyArXG4gICAgJ1xcdCAgICA8dGQgd2lkdGg9XCI2MFwiPjxzdHJvbmc+5a2m5Y6G5bGC5qyhPC9zdHJvbmc+PC90ZD4gICAgXFxuJyArXG4gICAgJ1xcdCAgICA8dGQ+PHN0cm9uZz7lip7lrabnsbvlnos8L3N0cm9uZz48L3RkPlxcbicgK1xuICAgICdcXHQgICAgPHRkIHdpZHRoPVwiNjBcIj48c3Ryb25nPumZouagoeexu+Weizwvc3Ryb25nPjwvdGQ+XFxuJyArXG4gICAgJ1xcdCAgICA8dGQ+PHN0cm9uZz7pgJrorq/lnLDlnYA8L3N0cm9uZz48L3RkPlxcbicgK1xuICAgICdcXHQgICAgPHRkPjxzdHJvbmc+6IGU57O755S16K+dPC9zdHJvbmc+PC90ZD5cXG4nICtcbiAgICAnXFx0ICAgIDx0ZD48c3Ryb25nPuWtpuagoee9keWdgDwvc3Ryb25nPjwvdGQ+XFxuJyArXG4gICAgJ1xcdCAgICBcXG4nICtcbiAgICAnXFx0ICA8L3RyPic7XG5zY2hlZHVsZXIuaW5pdChmYWN0b3J5KGdldFVSTCgwLCAyKSksIGZ1bmN0aW9uIChpZCkge1xuICAgIGxldCBtYXRhID0gc2NoZWR1bGVyLmdldE1hdGEoaWQpO1xuICAgIGlmIChtYXRhLnN0YXRlID09PSBNYXRhU3RhdGUuRklOSVNIKSB7XG4gICAgICAgIGxldCBkb2MgPSBtYXRhLmRhdGE7XG4gICAgICAgIGxldCB0cnMgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RhYmxlJylbMl0uZmlyc3RFbGVtZW50Q2hpbGQuY2hpbGRyZW47XG4gICAgICAgIGxldCBsZW5ndGggPSB0cnMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgZ2V0T3RoZXJEYXRhKHRyc1sxXSk7XG4gICAgICAgICAgICB0Ym9keS5hcHBlbmRDaGlsZCh0cnNbMV0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2ZhaWwnKVxuICAgIH1cbn0pO1xuZm9yIChsZXQgaSA9IDE7IGkgPCAyNDsgaSsrKSB7XG4gICAgc2NoZWR1bGVyLnB1c2goZmFjdG9yeShnZXRVUkwoaSAqIDIwLCAyKSksIGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBsZXQgbWF0YSA9IHNjaGVkdWxlci5nZXRNYXRhKGlkKTtcbiAgICAgICAgaWYgKG1hdGEuc3RhdGUgPT09IE1hdGFTdGF0ZS5GSU5JU0gpIHtcbiAgICAgICAgICAgIGxldCBkb2MgPSBtYXRhLmRhdGE7XG4gICAgICAgICAgICBsZXQgdHJzID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0YWJsZScpWzJdLmZpcnN0RWxlbWVudENoaWxkLmNoaWxkcmVuO1xuICAgICAgICAgICAgbGV0IGxlbmd0aCA9IHRycy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxlbmd0aCAtIDE7IGorKykge1xuICAgICAgICAgICAgICAgIGdldE90aGVyRGF0YSh0cnNbMV0pO1xuICAgICAgICAgICAgICAgIHRib2R5LmFwcGVuZENoaWxkKHRyc1sxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmFpbCcpXG4gICAgICAgIH1cbiAgICB9KVxufVxuc2NoZWR1bGVyLnNldEVuZEZ1bmN0aW9uKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xuICAgIHRhYmxlLmFwcGVuZENoaWxkKHRib2R5KTtcbiAgICBkb3dubG9hZE1vdWRsZS5kb3dubG9hZEZpbGUoJ29rLnhscycsIGRvd25sb2FkTW91ZGxlLmhlYWQgKyAnPGJvZHk+PHRhYmxlPicgKyB0YWJsZS5pbm5lckhUTUwgKyAnPC90YWJsZT48L2JvZHk+PC9odG1sPicpO1xufSk7XG5zY2hlZHVsZXIuc3RhcnQoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgTWF0YVBvb2wgZnJvbSAnLi9zcmMvc2NoZWR1bGVyJ1xuaW1wb3J0IGRvd25sb2FkTW91ZGxlIGZyb20gJy4vbGliL2Rvd25sb2FkTW91ZGxlJ1xuaW1wb3J0IHtXQUlULCBET0lORywgRklOSVNILCBGQUlMfSBmcm9tICcuL3NyYy9tYXRhJ1xuXG5jbGFzcyBTY2hlZHVsZXIge1xuICAgIGNvbnN0cnVjdG9yKG1heCkge1xuICAgICAgICB0aGlzLnBvb2wgPSBuZXcgTWF0YVBvb2wobWF4KTtcbiAgICAgICAgdGhpcy5faW5pdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXQocEZ1bmMsIGZGdW5jKSB7XG4gICAgICAgIGlmICghdGhpcy5faW5pdCkge1xuICAgICAgICAgICAgaWYgKHBGdW5jICYmIGZGdW5jKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb29sLnB1c2gocEZ1bmMsIGZGdW5jKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBnaXZlIHR3byBmdW5jdGlvbnMnKVxuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5pdCBhbHJlYWR5Jyk7XG4gICAgfVxuXG4gICAgcHVzaChwRnVuYywgZkZ1bmMpIHtcbiAgICAgICAgaWYgKHBGdW5jICYmIGZGdW5jKVxuICAgICAgICAgICAgdGhpcy5wb29sLnB1c2gocEZ1bmMsIGZGdW5jKTtcbiAgICB9XG5cbiAgICBzZXRFbmRGdW5jdGlvbihmdW5jKSB7XG4gICAgICAgIHRoaXMucG9vbC5lbmRGdW5jdGlvbiA9IGZ1bmM7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMucG9vbC5zdGFydCgpO1xuICAgIH1cblxuICAgIGNvbnRpbnVlKCkge1xuICAgICAgICB0aGlzLnBvb2wuY29udGludWUoKTtcbiAgICB9XG5cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLnBvb2wuc3RvcCgpO1xuICAgIH1cblxuICAgIGdldE1hdGEoaWQsIHVzZWQpIHtcbiAgICAgICAgaWYgKHVzZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb29sLmdldFVzZWQoaWQpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wb29sLmdldChpZCk7XG4gICAgfVxufVxuXG5jb25zdCBNYXRhU3RhdGUgPSB7V0FJVDogV0FJVCwgRE9JTkc6IERPSU5HLCBGSU5JU0g6IEZJTklTSCwgRkFJTDogRkFJTH07XG5leHBvcnQge2Rvd25sb2FkTW91ZGxlLCBTY2hlZHVsZXIsIE1hdGFTdGF0ZX1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9jcmV3anMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtNYXRhLCBNYXRhQXJyYXl9IGZyb20gJy4vbWF0YSdcblxuY2xhc3MgTWF0YVBvb2wge1xuICAgIGNvbnN0cnVjdG9yKG1heCkge1xuICAgICAgICB0aGlzLl9jb250aW51ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX3dhaXRpbmdQb29sID0gbmV3IE1hdGFBcnJheSgpO1xuICAgICAgICB0aGlzLl9kb2luZ1Bvb2wgPSBuZXcgTWF0YUFycmF5KCk7XG4gICAgICAgIHRoaXMuX2ZhaWxQb29sID0gbmV3IE1hdGFBcnJheSgpO1xuICAgICAgICB0aGlzLl9maW5pc2hQb29sID0gbmV3IE1hdGFBcnJheSgpO1xuICAgICAgICB0aGlzLl91c2VkUG9vbCA9IG5ldyBNYXRhQXJyYXkoKTtcbiAgICAgICAgdGhpcy5fYW1vdW50ID0gMDtcbiAgICAgICAgdGhpcy5tYXggPSBtYXg7XG4gICAgICAgIHRoaXMuZW5kRnVuY3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLnJlc29sdmUgPSB0aGlzLnJlc29sdmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yZWplY3QgPSB0aGlzLnJlamVjdC5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259dmFsdWVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufWJ1bmRsZVxuICAgICAqICovXG4gICAgcHVzaCh2YWx1ZSwgYnVuZGxlKSB7XG4gICAgICAgIHRoaXMuX3dhaXRpbmdQb29sLnB1c2gobmV3IE1hdGEodGhpcy5fYW1vdW50LCB2YWx1ZSwgYnVuZGxlKSk7XG4gICAgICAgIHRoaXMuX2Ftb3VudCsrO1xuICAgIH1cblxuICAgIGdldChpZCkge1xuICAgICAgICBsZXQgbWF0YSA9IHRoaXMuX2ZpbmlzaFBvb2wuX3ZhbHVlT2ZJZChpZCk7XG4gICAgICAgIGlmIChtYXRhKSB7XG4gICAgICAgICAgICB0aGlzLl9maW5pc2hQb29sLnJlbW92ZShtYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX3VzZWRQb29sLnB1c2gobWF0YSk7XG4gICAgICAgICAgICByZXR1cm4gbWF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmFpbFBvb2wuX3ZhbHVlT2ZJZChpZCk7XG4gICAgfVxuXG4gICAgZ2V0VXNlZChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXNlZFBvb2wuX3ZhbHVlT2ZJZChpZCk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9jb250aW51ZSAmJiB0aGlzLl93YWl0aW5nUG9vbC5sZW5ndGggJiYgKHRoaXMubWF4ID4gdGhpcy5fZG9pbmdQb29sLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIGxldCBtYXRhID0gdGhpcy5fd2FpdGluZ1Bvb2wucG9wKCk7XG4gICAgICAgICAgICBtYXRhLmdldFByb21pc2UoKS50aGVuKHRoaXMucmVzb2x2ZShtYXRhKSwgdGhpcy5yZWplY3QobWF0YSkpO1xuICAgICAgICAgICAgdGhpcy5fZG9pbmdQb29sLnB1c2gobWF0YSk7XG4gICAgICAgICAgICBtYXRhLmRvKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBldmVudExpc3RlbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dhaXRpbmdQb29sLmxlbmd0aCA9PT0gMCAmJiB0aGlzLl9kb2luZ1Bvb2wubGVuZ3RoID09PSAwICYmIHRoaXMuZW5kRnVuY3Rpb24pXG4gICAgICAgICAgICB0aGlzLmVuZEZ1bmN0aW9uKCk7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5fY29udGludWUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb250aW51ZSgpIHtcbiAgICAgICAgdGhpcy5fY29udGludWUgPSB0cnVlO1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcmVzb2x2ZShtYXRhKSB7XG4gICAgICAgIHJldHVybiAocmVzKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9kb2luZ1Bvb2wucmVtb3ZlKG1hdGEpO1xuICAgICAgICAgICAgdGhpcy5fZmluaXNoUG9vbC5wdXNoKG1hdGEpO1xuICAgICAgICAgICAgbWF0YS5maW5pc2gocmVzKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclYycgKyB0aGlzLnNob3coKSwgJ2NvbG9yOiMwMGZmMDAnKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRMaXN0ZW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlamVjdChtYXRhKSB7XG4gICAgICAgIHJldHVybiAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2RvaW5nUG9vbC5yZW1vdmUobWF0YSk7XG4gICAgICAgICAgICB0aGlzLl9mYWlsUG9vbC5wdXNoKG1hdGEpO1xuICAgICAgICAgICAgbWF0YS5mYWlsKGVycm9yKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclYycgKyB0aGlzLnNob3coKSwgJ2NvbG9yOmZmMDAwMCcpO1xuICAgICAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICAgICAgdGhpcy5ldmVudExpc3RlbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgcmV0dXJuICdmaW5pc2g6JyArIHRoaXMuX2ZpbmlzaFBvb2wubGVuZ3RoICsgJyB1c2VkOicgKyB0aGlzLl91c2VkUG9vbC5sZW5ndGggK1xuICAgICAgICAgICAgJyBmYWlsOicgKyB0aGlzLl9mYWlsUG9vbC5sZW5ndGggKyAnIHdhaXRpbmc6JyArIHRoaXMuX3dhaXRpbmdQb29sLmxlbmd0aCArXG4gICAgICAgICAgICAnIGRvaW5nOicgKyB0aGlzLl9kb2luZ1Bvb2wubGVuZ3RoO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWF0YVBvb2w7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vY3Jld2pzL3NyYy9zY2hlZHVsZXIuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGhlYWQgZnJvbSAnLi4vcmVzL3RwbCdcbmxldCBkb3dubG9hZE1vdWRsZSA9IHt9O1xuZG93bmxvYWRNb3VkbGUuaGVhZD1oZWFkO1xuZG93bmxvYWRNb3VkbGUuY3JlYXRlVGFibGUgPSBmdW5jdGlvbiAoanNvbikge1xuICAgIGxldCBjdGFibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0YWJsZScpO1xuICAgIGN0YWJsZS5pbm5lckhUTUwgPSAnJztcbiAgICBkb3dubG9hZE1vdWRsZS5faW5pdFRhYmxlKGpzb24sIGN0YWJsZSk7XG5cbiAgICBmb3IgKGxldCBpIGluIGpzb24pIHtcbiAgICAgICAgbGV0IHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICAgICAgZm9yIChsZXQgaiBpbiBqc29uW2ldKSB7XG4gICAgICAgICAgICBsZXQgdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgICAgICAgdGQudGV4dENvbnRlbnQgPSBqc29uW2ldW2pdO1xuICAgICAgICAgICAgLy9cdFx0XHR0ZC5zdHlsZS53aWR0aCA9ICcxMDBweCc7XG4gICAgICAgICAgICB0ci5hcHBlbmRDaGlsZCh0ZCk7XG4gICAgICAgIH1cbiAgICAgICAgY3RhYmxlLmFwcGVuZENoaWxkKHRyKTtcbiAgICB9XG4gICAgcmV0dXJuIGN0YWJsZTtcbn07XG5kb3dubG9hZE1vdWRsZS5faW5pdFRhYmxlID0gZnVuY3Rpb24gKGpzb24sIGN0YWJsZSkge1xuICAgIGxldCB0aHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgIGZvciAobGV0IGkgaW4ganNvblswXSkge1xuICAgICAgICBsZXQgdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aCcpO1xuICAgICAgICB0aC50ZXh0Q29udGVudCA9IGk7XG4gICAgICAgIHRoci5hcHBlbmRDaGlsZCh0aCk7XG4gICAgfVxuICAgIGN0YWJsZS5hcHBlbmRDaGlsZCh0aHIpO1xufTtcblxuZG93bmxvYWRNb3VkbGUuZG93bmxvYWRGaWxlID0gZnVuY3Rpb24gKGZpbGVOYW1lLCBjb250ZW50KSB7XG4gICAgbGV0IGFMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGxldCBibG9iID0gbmV3IEJsb2IoW2NvbnRlbnRdKTtcbiAgICBhTGluay5kb3dubG9hZCA9IGZpbGVOYW1lO1xuICAgIGFMaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIGFMaW5rLmNsaWNrKCk7XG59O1xuZXhwb3J0IGRlZmF1bHQgZG93bmxvYWRNb3VkbGVcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9jcmV3anMvbGliL2Rvd25sb2FkTW91ZGxlLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImxldCBoZWFkID0gWyc8aHRtbCB4bWxuczp2PVwidXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp2bWxcIiB4bWxuczpvPVwidXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTpvZmZpY2U6b2ZmaWNlXCIgeG1sbnM6eD1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOmV4Y2VsXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtaHRtbDQwXCI+JyxcbiAgICAnIDxoZWFkPicsXG4gICAgJyAgPG1ldGEgaHR0cC1lcXVpdj1cIkNvbnRlbnQtVHlwZVwiIGNvbnRlbnQ9XCJ0ZXh0L2h0bWw7IGNoYXJzZXQ9dXRmLThcIi8+JyxcbiAgICAnICA8bWV0YSBuYW1lPVwiUHJvZ0lkXCIgY29udGVudD1cIkV4Y2VsLlNoZWV0XCIvPicsXG4gICAgJyAgPG1ldGEgbmFtZT1cIkdlbmVyYXRvclwiIGNvbnRlbnQ9XCJXUFMgT2ZmaWNlIEVUXCIvPicsXG4gICAgJyAgPCEtLVtpZiBndGUgbXNvIDldPicsXG4gICAgJyAgIDx4bWw+JyxcbiAgICAnICAgIDxvOkRvY3VtZW50UHJvcGVydGllcz4nLFxuICAgICcgICAgIDxvOkNyZWF0ZWQ+MjAxNy0wOC0wMVQxNDo1MDoxNjwvbzpDcmVhdGVkPicsXG4gICAgJyAgICAgPG86TGFzdEF1dGhvcj5wZW5nPC9vOkxhc3RBdXRob3I+JyxcbiAgICAnICAgICA8bzpMYXN0U2F2ZWQ+MjAxNy0wOC0wMVQxNToxMTo1NDwvbzpMYXN0U2F2ZWQ+JyxcbiAgICAnICAgIDwvbzpEb2N1bWVudFByb3BlcnRpZXM+JyxcbiAgICAnICAgIDxvOkN1c3RvbURvY3VtZW50UHJvcGVydGllcz4nLFxuICAgICcgICAgIDxvOktTT1Byb2R1Y3RCdWlsZFZlciBkdDpkdD1cInN0cmluZ1wiPjIwNTItMTAuMS4wLjY2OTA8L286S1NPUHJvZHVjdEJ1aWxkVmVyPicsXG4gICAgJyAgICA8L286Q3VzdG9tRG9jdW1lbnRQcm9wZXJ0aWVzPicsXG4gICAgJyAgIDwveG1sPicsXG4gICAgJyAgPCFbZW5kaWZdLS0+JyxcbiAgICAnICA8IS0tW2lmIGd0ZSBtc28gOV0+JyxcbiAgICAnICAgPHhtbD4nLFxuICAgICcgICAgPHg6RXhjZWxXb3JrYm9vaz4nLFxuICAgICcgICAgIDx4OkV4Y2VsV29ya3NoZWV0cz4nLFxuICAgICcgICAgICA8eDpFeGNlbFdvcmtzaGVldD4nLFxuICAgICcgICAgICAgPHg6TmFtZT5vayAoMSk8L3g6TmFtZT4nLFxuICAgICcgICAgICAgPHg6V29ya3NoZWV0T3B0aW9ucz4nLFxuICAgICcgICAgICAgIDx4OkRlZmF1bHRSb3dIZWlnaHQ+MjcwPC94OkRlZmF1bHRSb3dIZWlnaHQ+JyxcbiAgICAnICAgICAgICA8eDpTZWxlY3RlZC8+JyxcbiAgICAnICAgICAgICA8eDpQYW5lcz4nLFxuICAgICcgICAgICAgICA8eDpQYW5lPicsXG4gICAgJyAgICAgICAgICA8eDpOdW1iZXI+MzwveDpOdW1iZXI+JyxcbiAgICAnICAgICAgICAgIDx4OkFjdGl2ZUNvbD4zPC94OkFjdGl2ZUNvbD4nLFxuICAgICcgICAgICAgICAgPHg6QWN0aXZlUm93PjY8L3g6QWN0aXZlUm93PicsXG4gICAgJyAgICAgICAgICA8eDpSYW5nZVNlbGVjdGlvbj5ENzwveDpSYW5nZVNlbGVjdGlvbj4nLFxuICAgICcgICAgICAgICA8L3g6UGFuZT4nLFxuICAgICcgICAgICAgIDwveDpQYW5lcz4nLFxuICAgICcgICAgICAgIDx4OkRvTm90RGlzcGxheUdyaWRsaW5lcy8+JyxcbiAgICAnICAgICAgICA8eDpQcm90ZWN0Q29udGVudHM+RmFsc2U8L3g6UHJvdGVjdENvbnRlbnRzPicsXG4gICAgJyAgICAgICAgPHg6UHJvdGVjdE9iamVjdHM+RmFsc2U8L3g6UHJvdGVjdE9iamVjdHM+JyxcbiAgICAnICAgICAgICA8eDpQcm90ZWN0U2NlbmFyaW9zPkZhbHNlPC94OlByb3RlY3RTY2VuYXJpb3M+JyxcbiAgICAnICAgICAgICA8eDpQcmludD4nLFxuICAgICcgICAgICAgICA8eDpQYXBlclNpemVJbmRleD45PC94OlBhcGVyU2l6ZUluZGV4PicsXG4gICAgJyAgICAgICAgPC94OlByaW50PicsXG4gICAgJyAgICAgICA8L3g6V29ya3NoZWV0T3B0aW9ucz4nLFxuICAgICcgICAgICA8L3g6RXhjZWxXb3Jrc2hlZXQ+JyxcbiAgICAnICAgICA8L3g6RXhjZWxXb3Jrc2hlZXRzPicsXG4gICAgJyAgICAgPHg6UHJvdGVjdFN0cnVjdHVyZT5GYWxzZTwveDpQcm90ZWN0U3RydWN0dXJlPicsXG4gICAgJyAgICAgPHg6UHJvdGVjdFdpbmRvd3M+RmFsc2U8L3g6UHJvdGVjdFdpbmRvd3M+JyxcbiAgICAnICAgICA8eDpXaW5kb3dIZWlnaHQ+MTMwNTA8L3g6V2luZG93SGVpZ2h0PicsXG4gICAgJyAgICAgPHg6V2luZG93V2lkdGg+Mjg2OTU8L3g6V2luZG93V2lkdGg+JyxcbiAgICAnICAgIDwveDpFeGNlbFdvcmtib29rPicsXG4gICAgJyAgIDwveG1sPicsXG4gICAgJyAgPCFbZW5kaWZdLS0+JyxcbiAgICAnIDwvaGVhZD4nXG5dLmpvaW4oXCJcIik7XG5leHBvcnQgZGVmYXVsdCBoZWFkO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2NyZXdqcy9yZXMvdHBsLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=