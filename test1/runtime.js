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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDQzNWQ3NGIzYjU4ODNiZjdlNjYiLCJ3ZWJwYWNrOi8vLy4uL2NyZXdqcy9zcmMvbWF0YS5qcyIsIndlYnBhY2s6Ly8vLi9tYWluLmpzIiwid2VicGFjazovLy8uLi9jcmV3anMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4uL2NyZXdqcy9zcmMvc2NoZWR1bGVyLmpzIiwid2VicGFjazovLy8uLi9jcmV3anMvbGliL2Rvd25sb2FkTW91ZGxlLmpzIiwid2VicGFjazovLy8uLi9jcmV3anMvcmVzL3RwbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNyRTZDOztBQUU3QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDOztBQUVBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDOztBQUVBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixPQUFPO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixnQkFBZ0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixnQkFBZ0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxrQjs7Ozs7Ozs7Ozs7OztBQ3JJQTtBQUNBO0FBQ2tDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1COzs7Ozs7Ozs7QUNuREs7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLFNBQVM7QUFDeEIsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1FOzs7Ozs7OztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1RTs7Ozs7OztBQ3JDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRCIsImZpbGUiOiJydW50aW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDQzNWQ3NGIzYjU4ODNiZjdlNjYiLCJjb25zdCBXQUlUID0gMDtcbmNvbnN0IERPSU5HID0gMTtcbmNvbnN0IEZJTklTSCA9IDI7XG5jb25zdCBGQUlMID0gMztcblxuY2xhc3MgTWF0YSB7XG4gICAgY29uc3RydWN0b3IoaWQsIGZ1bmMsIGJ1bmRsZSkge1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuZ2V0UHJvbWlzZSA9IGZ1bmM7XG4gICAgICAgIHRoaXMuYnVuZGxlID0gYnVuZGxlO1xuICAgICAgICB0aGlzLnN0YXRlID0gV0FJVDtcbiAgICAgICAgdGhpcy5kYXRhID0gbnVsbDtcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XG4gICAgfVxuXG4gICAgZG8oKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBET0lORztcbiAgICB9XG5cbiAgICBmYWlsKGVycm9yKSB7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IEZBSUw7XG4gICAgICAgIHRoaXMuYnVuZGxlKHRoaXMuaWQpXG4gICAgfVxuXG4gICAgZmluaXNoKHJlcykge1xuICAgICAgICB0aGlzLmRhdGEgPSByZXM7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBGSU5JU0g7XG4gICAgICAgIHRoaXMuYnVuZGxlKHRoaXMuaWQpXG4gICAgfVxufVxuXG5jbGFzcyBNYXRhQXJyYXkge1xuICAgIGNvbnN0cnVjdG9yKC4uLm1hdGFzKSB7XG4gICAgICAgIHRoaXMuX3JlcWFyID0gW107XG4gICAgICAgIGlmIChtYXRhcylcbiAgICAgICAgICAgIHRoaXMucHVzaCguLi5tYXRhcyk7XG4gICAgfVxuXG4gICAgcHVzaCguLi5tYXRhcykge1xuICAgICAgICBsZXQgZmFpbEFtb3VudCA9IDA7XG4gICAgICAgIG1hdGFzLmZvckVhY2goZnVuY3Rpb24gKG1hdGEpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmFsdWVPZklkKG1hdGEpKVxuICAgICAgICAgICAgICAgIHRoaXMuX3JlcWFyLnB1c2gobWF0YSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZmFpbEFtb3VudCsrO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhaWxBbW91bnQ7XG4gICAgfVxuXG4gICAgcG9wKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVxYXIucG9wKCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKG1hdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlcWFyLnNwbGljZSh0aGlzLl9yZXFhci5pbmRleE9mKG1hdGEpLCAxKTtcbiAgICB9XG5cbiAgICBfdmFsdWVPZklkKGlkKSB7XG4gICAgICAgIGZvciAobGV0IG1hdGEgb2YgdGhpcy5fcmVxYXIpIHtcbiAgICAgICAgICAgIGlmIChtYXRhLmlkID09PSBpZClcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0YTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXFhci5sZW5ndGg7XG4gICAgfVxuXG59XG5cbmV4cG9ydCB7TWF0YSwgTWF0YUFycmF5LCBXQUlULCBET0lORywgRklOSVNILCBGQUlMfVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2NyZXdqcy9zcmMvbWF0YS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge1NjaGVkdWxlciwgZG93bmxvYWRNb3VkbGUsIE1hdGFTdGF0ZX0gZnJvbSAnY3Jld2pzJ1xuXG5sZXQgc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcigzMyk7XG53aW5kb3cuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuXG5mdW5jdGlvbiBnZXRVUkwobnVtLCB5eGpieikge1xuICAgIGlmICh5eGpieilcbiAgICAgICAgcmV0dXJuICdodHRwOi8vZ2Fva2FvLmNoc2kuY29tLmNuL3NjaC9zZWFyY2gtLXl4amJ6LScgKyB5eGpieiArICcsc2VhcmNoVHlwZS0xLHN0YXJ0LScgKyBudW0gKyAnLmRodG1sJztcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiAnaHR0cDovL2dhb2thby5jaHNpLmNvbS5jbi9zY2gvc2VhcmNoLS1zcy1vbixzZWFyY2hUeXBlLTEsb3B0aW9uLXFnLHN0YXJ0LScgKyBudW0gKyAnLmRodG1sJztcbn1cblxuZnVuY3Rpb24gZmFjdG9yeSh1cmwpIHtcbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiovXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7IC8vZ2V06K+35rGC77yM6K+35rGC5Zyw5Z2A77yM5piv5ZCm5byC5q2lXG4gICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJkb2N1bWVudFwiO1xuXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRvYyA9IHhoci5yZXNwb25zZTsgLy8g5rOo5oSPOuS4jeaYr29SZXEucmVzcG9uc2VUZXh0XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChcInBhcnNlciBkb2N1bWVudCBmYWlseVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChcInN0YXR1cyE9MjAwXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0T3RoZXJEYXRhKHRyKSB7XG4gICAgaWYgKHRyLmZpcnN0RWxlbWVudENoaWxkICYmIHRyLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkKVxuICAgICAgICBzY2hlZHVsZXIucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgdXJsID0gdHIuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQuaHJlZjtcbiAgICAgICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7IC8vZ2V06K+35rGC77yM6K+35rGC5Zyw5Z2A77yM5piv5ZCm5byC5q2lXG4gICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiZG9jdW1lbnRcIjtcblxuICAgICAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkb2MgPSB4aHIucmVzcG9uc2U7IC8vIOazqOaEjzrkuI3mmK9vUmVxLnJlc3BvbnNlVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRvYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwicGFyc2VyIGRvY3VtZW50IGZhaWx5XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwic3RhdHVzIT0yMDBcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sIGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgbGV0IG1hdGEgPSBzY2hlZHVsZXIuZ2V0TWF0YShpZCk7XG4gICAgICAgICAgICBpZiAobWF0YS5zdGF0ZSA9PT0gTWF0YVN0YXRlLkZJTklTSCkge1xuICAgICAgICAgICAgICAgIGxldCBkb2MgPSBtYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgbGV0IGRpdnMgPSBkb2MuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncl9jX3NjaF9hdHRyXzEnKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMzsgaSA8IDY7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGl2c1tpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRkLmlubmVyVGV4dCA9IGRpdnNbaV0uaW5uZXJUZXh0LnNsaWNlKDYpLnJlcGxhY2UoL1tcXHJcXG5dL2csIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB0ci5hcHBlbmRDaGlsZCh0ZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmFpbCcpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG59XG5cbmxldCB0Ym9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Rib2R5Jyk7XG50Ym9keS5pbm5lckhUTUwgPSAnPHRyIGJnY29sb3I9XCIjRjZGRUY1XCIgYWxpZ249XCJjZW50ZXJcIiB2YWxpZ249XCJtaWRkbGVcIj5cXG4nICtcbiAgICAnXFx0ICAgIDx0ZCBoZWlnaHQ9XCIyNVwiPjxzdHJvbmc+6Zmi5qCh5ZCN56ewPC9zdHJvbmc+PC90ZD5cXG4nICtcbiAgICAnXFx0ICAgIDx0ZCB3aWR0aD1cIjQ1XCI+PHN0cm9uZz7miYDlnKjlnLA8L3N0cm9uZz48L3RkPlxcbicgK1xuICAgICdcXHQgICAgPHRkIHdpZHRoPVwiMTQwXCI+PHN0cm9uZz7pmaLmoKHpmrblsZ48L3N0cm9uZz48L3RkPlxcbicgK1xuICAgICdcXHQgICAgPHRkIHdpZHRoPVwiNjBcIj48c3Ryb25nPuWtpuWOhuWxguasoTwvc3Ryb25nPjwvdGQ+ICAgIFxcbicgK1xuICAgICdcXHQgICAgPHRkPjxzdHJvbmc+5Yqe5a2m57G75Z6LPC9zdHJvbmc+PC90ZD5cXG4nICtcbiAgICAnXFx0ICAgIDx0ZCB3aWR0aD1cIjYwXCI+PHN0cm9uZz7pmaLmoKHnsbvlnos8L3N0cm9uZz48L3RkPlxcbicgK1xuICAgICdcXHQgICAgPHRkPjxzdHJvbmc+6YCa6K6v5Zyw5Z2APC9zdHJvbmc+PC90ZD5cXG4nICtcbiAgICAnXFx0ICAgIDx0ZD48c3Ryb25nPuiBlOezu+eUteivnTwvc3Ryb25nPjwvdGQ+XFxuJyArXG4gICAgJ1xcdCAgICA8dGQ+PHN0cm9uZz7lrabmoKHnvZHlnYA8L3N0cm9uZz48L3RkPlxcbicgK1xuICAgICdcXHQgICAgXFxuJyArXG4gICAgJ1xcdCAgPC90cj4nO1xuc2NoZWR1bGVyLmluaXQoZmFjdG9yeShnZXRVUkwoMCwgMikpLCBmdW5jdGlvbiAoaWQpIHtcbiAgICBsZXQgbWF0YSA9IHNjaGVkdWxlci5nZXRNYXRhKGlkKTtcbiAgICBpZiAobWF0YS5zdGF0ZSA9PT0gTWF0YVN0YXRlLkZJTklTSCkge1xuICAgICAgICBsZXQgZG9jID0gbWF0YS5kYXRhO1xuICAgICAgICBsZXQgdHJzID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0YWJsZScpWzJdLmZpcnN0RWxlbWVudENoaWxkLmNoaWxkcmVuO1xuICAgICAgICBsZXQgbGVuZ3RoID0gdHJzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGdldE90aGVyRGF0YSh0cnNbMV0pO1xuICAgICAgICAgICAgdGJvZHkuYXBwZW5kQ2hpbGQodHJzWzFdKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdmYWlsJylcbiAgICB9XG59KTtcbmZvciAobGV0IGkgPSAxOyBpIDwgMjQ7IGkrKykge1xuICAgIHNjaGVkdWxlci5wdXNoKGZhY3RvcnkoZ2V0VVJMKGkgKiAyMCwgMikpLCBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgbGV0IG1hdGEgPSBzY2hlZHVsZXIuZ2V0TWF0YShpZCk7XG4gICAgICAgIGlmIChtYXRhLnN0YXRlID09PSBNYXRhU3RhdGUuRklOSVNIKSB7XG4gICAgICAgICAgICBsZXQgZG9jID0gbWF0YS5kYXRhO1xuICAgICAgICAgICAgbGV0IHRycyA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGFibGUnKVsyXS5maXJzdEVsZW1lbnRDaGlsZC5jaGlsZHJlbjtcbiAgICAgICAgICAgIGxldCBsZW5ndGggPSB0cnMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW5ndGggLSAxOyBqKyspIHtcbiAgICAgICAgICAgICAgICBnZXRPdGhlckRhdGEodHJzWzFdKTtcbiAgICAgICAgICAgICAgICB0Ym9keS5hcHBlbmRDaGlsZCh0cnNbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZhaWwnKVxuICAgICAgICB9XG4gICAgfSlcbn1cbnNjaGVkdWxlci5zZXRFbmRGdW5jdGlvbihmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHRhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcbiAgICB0YWJsZS5hcHBlbmRDaGlsZCh0Ym9keSk7XG4gICAgZG93bmxvYWRNb3VkbGUuZG93bmxvYWRGaWxlKCdvay54bHMnLCBkb3dubG9hZE1vdWRsZS5oZWFkICsgJzxib2R5Pjx0YWJsZT4nICsgdGFibGUuaW5uZXJIVE1MICsgJzwvdGFibGU+PC9ib2R5PjwvaHRtbD4nKTtcbn0pO1xuc2NoZWR1bGVyLnN0YXJ0KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBNYXRhUG9vbCBmcm9tICcuL3NyYy9zY2hlZHVsZXInXG5pbXBvcnQgZG93bmxvYWRNb3VkbGUgZnJvbSAnLi9saWIvZG93bmxvYWRNb3VkbGUnXG5pbXBvcnQge1dBSVQsIERPSU5HLCBGSU5JU0gsIEZBSUx9IGZyb20gJy4vc3JjL21hdGEnXG5cbmNsYXNzIFNjaGVkdWxlciB7XG4gICAgY29uc3RydWN0b3IobWF4KSB7XG4gICAgICAgIHRoaXMucG9vbCA9IG5ldyBNYXRhUG9vbChtYXgpO1xuICAgICAgICB0aGlzLl9pbml0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdChwRnVuYywgZkZ1bmMpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0KSB7XG4gICAgICAgICAgICBpZiAocEZ1bmMgJiYgZkZ1bmMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvb2wucHVzaChwRnVuYywgZkZ1bmMpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIGdpdmUgdHdvIGZ1bmN0aW9ucycpXG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbml0IGFscmVhZHknKTtcbiAgICB9XG5cbiAgICBwdXNoKHBGdW5jLCBmRnVuYykge1xuICAgICAgICBpZiAocEZ1bmMgJiYgZkZ1bmMpXG4gICAgICAgICAgICB0aGlzLnBvb2wucHVzaChwRnVuYywgZkZ1bmMpO1xuICAgIH1cblxuICAgIHNldEVuZEZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5wb29sLmVuZEZ1bmN0aW9uID0gZnVuYztcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5wb29sLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgY29udGludWUoKSB7XG4gICAgICAgIHRoaXMucG9vbC5jb250aW51ZSgpO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMucG9vbC5zdG9wKCk7XG4gICAgfVxuXG4gICAgZ2V0TWF0YShpZCwgdXNlZCkge1xuICAgICAgICBpZiAodXNlZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvb2wuZ2V0VXNlZChpZCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBvb2wuZ2V0KGlkKTtcbiAgICB9XG59XG5cbmNvbnN0IE1hdGFTdGF0ZSA9IHtXQUlUOiBXQUlULCBET0lORzogRE9JTkcsIEZJTklTSDogRklOSVNILCBGQUlMOiBGQUlMfTtcbmV4cG9ydCB7ZG93bmxvYWRNb3VkbGUsIFNjaGVkdWxlciwgTWF0YVN0YXRlfVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2NyZXdqcy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge01hdGEsIE1hdGFBcnJheX0gZnJvbSAnLi9tYXRhJ1xuXG5jbGFzcyBNYXRhUG9vbCB7XG4gICAgY29uc3RydWN0b3IobWF4KSB7XG4gICAgICAgIHRoaXMuX2NvbnRpbnVlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fd2FpdGluZ1Bvb2wgPSBuZXcgTWF0YUFycmF5KCk7XG4gICAgICAgIHRoaXMuX2RvaW5nUG9vbCA9IG5ldyBNYXRhQXJyYXkoKTtcbiAgICAgICAgdGhpcy5fZmFpbFBvb2wgPSBuZXcgTWF0YUFycmF5KCk7XG4gICAgICAgIHRoaXMuX2ZpbmlzaFBvb2wgPSBuZXcgTWF0YUFycmF5KCk7XG4gICAgICAgIHRoaXMuX3VzZWRQb29sID0gbmV3IE1hdGFBcnJheSgpO1xuICAgICAgICB0aGlzLl9hbW91bnQgPSAwO1xuICAgICAgICB0aGlzLm1heCA9IG1heDtcbiAgICAgICAgdGhpcy5lbmRGdW5jdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IHRoaXMucmVzb2x2ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnJlamVjdCA9IHRoaXMucmVqZWN0LmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn12YWx1ZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259YnVuZGxlXG4gICAgICogKi9cbiAgICBwdXNoKHZhbHVlLCBidW5kbGUpIHtcbiAgICAgICAgdGhpcy5fd2FpdGluZ1Bvb2wucHVzaChuZXcgTWF0YSh0aGlzLl9hbW91bnQsIHZhbHVlLCBidW5kbGUpKTtcbiAgICAgICAgdGhpcy5fYW1vdW50Kys7XG4gICAgfVxuXG4gICAgZ2V0KGlkKSB7XG4gICAgICAgIGxldCBtYXRhID0gdGhpcy5fZmluaXNoUG9vbC5fdmFsdWVPZklkKGlkKTtcbiAgICAgICAgaWYgKG1hdGEpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZpbmlzaFBvb2wucmVtb3ZlKG1hdGEpO1xuICAgICAgICAgICAgdGhpcy5fdXNlZFBvb2wucHVzaChtYXRhKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mYWlsUG9vbC5fdmFsdWVPZklkKGlkKTtcbiAgICB9XG5cbiAgICBnZXRVc2VkKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VkUG9vbC5fdmFsdWVPZklkKGlkKTtcbiAgICB9XG5cbiAgICAvL21ha2UgbWF0YSB0byBkb1xuICAgIHN0YXJ0KCkge1xuICAgICAgICB3aGlsZSAodGhpcy5fY29udGludWUgJiYgdGhpcy5fd2FpdGluZ1Bvb2wubGVuZ3RoICYmICh0aGlzLm1heCA+IHRoaXMuX2RvaW5nUG9vbC5sZW5ndGgpKSB7XG4gICAgICAgICAgICBsZXQgbWF0YSA9IHRoaXMuX3dhaXRpbmdQb29sLnBvcCgpO1xuICAgICAgICAgICAgbWF0YS5nZXRQcm9taXNlKCkudGhlbih0aGlzLnJlc29sdmUobWF0YSksIHRoaXMucmVqZWN0KG1hdGEpKTtcbiAgICAgICAgICAgIHRoaXMuX2RvaW5nUG9vbC5wdXNoKG1hdGEpO1xuICAgICAgICAgICAgbWF0YS5kbygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXZlbnRMaXN0ZW4oKSB7XG4gICAgICAgIGlmICh0aGlzLl93YWl0aW5nUG9vbC5sZW5ndGggPT09IDAgJiYgdGhpcy5fZG9pbmdQb29sLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmVuZEZ1bmN0aW9uKVxuICAgICAgICAgICAgdGhpcy5lbmRGdW5jdGlvbigpO1xuICAgIH1cblxuICAgIHN0b3AoKSB7XG4gICAgICAgIHRoaXMuX2NvbnRpbnVlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29udGludWUoKSB7XG4gICAgICAgIHRoaXMuX2NvbnRpbnVlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cblxuICAgIHJlc29sdmUobWF0YSkge1xuICAgICAgICByZXR1cm4gKHJlcykgPT4ge1xuICAgICAgICAgICAgdGhpcy5fZG9pbmdQb29sLnJlbW92ZShtYXRhKTtcbiAgICAgICAgICAgIHRoaXMuX2ZpbmlzaFBvb2wucHVzaChtYXRhKTtcbiAgICAgICAgICAgIG1hdGEuZmluaXNoKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWMnICsgdGhpcy5zaG93KCksICdjb2xvcjojMDBmZjAwJyk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50TGlzdGVuKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWplY3QobWF0YSkge1xuICAgICAgICByZXR1cm4gKGVycm9yKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9kb2luZ1Bvb2wucmVtb3ZlKG1hdGEpO1xuICAgICAgICAgICAgdGhpcy5fZmFpbFBvb2wucHVzaChtYXRhKTtcbiAgICAgICAgICAgIG1hdGEuZmFpbChlcnJvcik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWMnICsgdGhpcy5zaG93KCksICdjb2xvcjpmZjAwMDAnKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRMaXN0ZW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICAgIHJldHVybiAnZmluaXNoOicgKyB0aGlzLl9maW5pc2hQb29sLmxlbmd0aCArICcgdXNlZDonICsgdGhpcy5fdXNlZFBvb2wubGVuZ3RoICtcbiAgICAgICAgICAgICcgZmFpbDonICsgdGhpcy5fZmFpbFBvb2wubGVuZ3RoICsgJyB3YWl0aW5nOicgKyB0aGlzLl93YWl0aW5nUG9vbC5sZW5ndGggK1xuICAgICAgICAgICAgJyBkb2luZzonICsgdGhpcy5fZG9pbmdQb29sLmxlbmd0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1hdGFQb29sO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL2NyZXdqcy9zcmMvc2NoZWR1bGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBoZWFkIGZyb20gJy4uL3Jlcy90cGwnXG5sZXQgZG93bmxvYWRNb3VkbGUgPSB7fTtcbmRvd25sb2FkTW91ZGxlLmhlYWQ9aGVhZDtcbmRvd25sb2FkTW91ZGxlLmNyZWF0ZVRhYmxlID0gZnVuY3Rpb24gKGpzb24pIHtcbiAgICBsZXQgY3RhYmxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGFibGUnKTtcbiAgICBjdGFibGUuaW5uZXJIVE1MID0gJyc7XG4gICAgZG93bmxvYWRNb3VkbGUuX2luaXRUYWJsZShqc29uLCBjdGFibGUpO1xuXG4gICAgZm9yIChsZXQgaSBpbiBqc29uKSB7XG4gICAgICAgIGxldCB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIGZvciAobGV0IGogaW4ganNvbltpXSkge1xuICAgICAgICAgICAgbGV0IHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgICAgICAgIHRkLnRleHRDb250ZW50ID0ganNvbltpXVtqXTtcbiAgICAgICAgICAgIC8vXHRcdFx0dGQuc3R5bGUud2lkdGggPSAnMTAwcHgnO1xuICAgICAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGQpO1xuICAgICAgICB9XG4gICAgICAgIGN0YWJsZS5hcHBlbmRDaGlsZCh0cik7XG4gICAgfVxuICAgIHJldHVybiBjdGFibGU7XG59O1xuZG93bmxvYWRNb3VkbGUuX2luaXRUYWJsZSA9IGZ1bmN0aW9uIChqc29uLCBjdGFibGUpIHtcbiAgICBsZXQgdGhyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICBmb3IgKGxldCBpIGluIGpzb25bMF0pIHtcbiAgICAgICAgbGV0IHRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcbiAgICAgICAgdGgudGV4dENvbnRlbnQgPSBpO1xuICAgICAgICB0aHIuYXBwZW5kQ2hpbGQodGgpO1xuICAgIH1cbiAgICBjdGFibGUuYXBwZW5kQ2hpbGQodGhyKTtcbn07XG5cbmRvd25sb2FkTW91ZGxlLmRvd25sb2FkRmlsZSA9IGZ1bmN0aW9uIChmaWxlTmFtZSwgY29udGVudCkge1xuICAgIGxldCBhTGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBsZXQgYmxvYiA9IG5ldyBCbG9iKFtjb250ZW50XSk7XG4gICAgYUxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZTtcbiAgICBhTGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICBhTGluay5jbGljaygpO1xufTtcbmV4cG9ydCBkZWZhdWx0IGRvd25sb2FkTW91ZGxlXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vY3Jld2pzL2xpYi9kb3dubG9hZE1vdWRsZS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJsZXQgaGVhZCA9IFsnPGh0bWwgeG1sbnM6dj1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206dm1sXCIgeG1sbnM6bz1cInVybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206b2ZmaWNlOm9mZmljZVwiIHhtbG5zOng9XCJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOm9mZmljZTpleGNlbFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLWh0bWw0MFwiPicsXG4gICAgJyA8aGVhZD4nLFxuICAgICcgIDxtZXRhIGh0dHAtZXF1aXY9XCJDb250ZW50LVR5cGVcIiBjb250ZW50PVwidGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04XCIvPicsXG4gICAgJyAgPG1ldGEgbmFtZT1cIlByb2dJZFwiIGNvbnRlbnQ9XCJFeGNlbC5TaGVldFwiLz4nLFxuICAgICcgIDxtZXRhIG5hbWU9XCJHZW5lcmF0b3JcIiBjb250ZW50PVwiV1BTIE9mZmljZSBFVFwiLz4nLFxuICAgICcgIDwhLS1baWYgZ3RlIG1zbyA5XT4nLFxuICAgICcgICA8eG1sPicsXG4gICAgJyAgICA8bzpEb2N1bWVudFByb3BlcnRpZXM+JyxcbiAgICAnICAgICA8bzpDcmVhdGVkPjIwMTctMDgtMDFUMTQ6NTA6MTY8L286Q3JlYXRlZD4nLFxuICAgICcgICAgIDxvOkxhc3RBdXRob3I+cGVuZzwvbzpMYXN0QXV0aG9yPicsXG4gICAgJyAgICAgPG86TGFzdFNhdmVkPjIwMTctMDgtMDFUMTU6MTE6NTQ8L286TGFzdFNhdmVkPicsXG4gICAgJyAgICA8L286RG9jdW1lbnRQcm9wZXJ0aWVzPicsXG4gICAgJyAgICA8bzpDdXN0b21Eb2N1bWVudFByb3BlcnRpZXM+JyxcbiAgICAnICAgICA8bzpLU09Qcm9kdWN0QnVpbGRWZXIgZHQ6ZHQ9XCJzdHJpbmdcIj4yMDUyLTEwLjEuMC42NjkwPC9vOktTT1Byb2R1Y3RCdWlsZFZlcj4nLFxuICAgICcgICAgPC9vOkN1c3RvbURvY3VtZW50UHJvcGVydGllcz4nLFxuICAgICcgICA8L3htbD4nLFxuICAgICcgIDwhW2VuZGlmXS0tPicsXG4gICAgJyAgPCEtLVtpZiBndGUgbXNvIDldPicsXG4gICAgJyAgIDx4bWw+JyxcbiAgICAnICAgIDx4OkV4Y2VsV29ya2Jvb2s+JyxcbiAgICAnICAgICA8eDpFeGNlbFdvcmtzaGVldHM+JyxcbiAgICAnICAgICAgPHg6RXhjZWxXb3Jrc2hlZXQ+JyxcbiAgICAnICAgICAgIDx4Ok5hbWU+b2sgKDEpPC94Ok5hbWU+JyxcbiAgICAnICAgICAgIDx4OldvcmtzaGVldE9wdGlvbnM+JyxcbiAgICAnICAgICAgICA8eDpEZWZhdWx0Um93SGVpZ2h0PjI3MDwveDpEZWZhdWx0Um93SGVpZ2h0PicsXG4gICAgJyAgICAgICAgPHg6U2VsZWN0ZWQvPicsXG4gICAgJyAgICAgICAgPHg6UGFuZXM+JyxcbiAgICAnICAgICAgICAgPHg6UGFuZT4nLFxuICAgICcgICAgICAgICAgPHg6TnVtYmVyPjM8L3g6TnVtYmVyPicsXG4gICAgJyAgICAgICAgICA8eDpBY3RpdmVDb2w+MzwveDpBY3RpdmVDb2w+JyxcbiAgICAnICAgICAgICAgIDx4OkFjdGl2ZVJvdz42PC94OkFjdGl2ZVJvdz4nLFxuICAgICcgICAgICAgICAgPHg6UmFuZ2VTZWxlY3Rpb24+RDc8L3g6UmFuZ2VTZWxlY3Rpb24+JyxcbiAgICAnICAgICAgICAgPC94OlBhbmU+JyxcbiAgICAnICAgICAgICA8L3g6UGFuZXM+JyxcbiAgICAnICAgICAgICA8eDpEb05vdERpc3BsYXlHcmlkbGluZXMvPicsXG4gICAgJyAgICAgICAgPHg6UHJvdGVjdENvbnRlbnRzPkZhbHNlPC94OlByb3RlY3RDb250ZW50cz4nLFxuICAgICcgICAgICAgIDx4OlByb3RlY3RPYmplY3RzPkZhbHNlPC94OlByb3RlY3RPYmplY3RzPicsXG4gICAgJyAgICAgICAgPHg6UHJvdGVjdFNjZW5hcmlvcz5GYWxzZTwveDpQcm90ZWN0U2NlbmFyaW9zPicsXG4gICAgJyAgICAgICAgPHg6UHJpbnQ+JyxcbiAgICAnICAgICAgICAgPHg6UGFwZXJTaXplSW5kZXg+OTwveDpQYXBlclNpemVJbmRleD4nLFxuICAgICcgICAgICAgIDwveDpQcmludD4nLFxuICAgICcgICAgICAgPC94OldvcmtzaGVldE9wdGlvbnM+JyxcbiAgICAnICAgICAgPC94OkV4Y2VsV29ya3NoZWV0PicsXG4gICAgJyAgICAgPC94OkV4Y2VsV29ya3NoZWV0cz4nLFxuICAgICcgICAgIDx4OlByb3RlY3RTdHJ1Y3R1cmU+RmFsc2U8L3g6UHJvdGVjdFN0cnVjdHVyZT4nLFxuICAgICcgICAgIDx4OlByb3RlY3RXaW5kb3dzPkZhbHNlPC94OlByb3RlY3RXaW5kb3dzPicsXG4gICAgJyAgICAgPHg6V2luZG93SGVpZ2h0PjEzMDUwPC94OldpbmRvd0hlaWdodD4nLFxuICAgICcgICAgIDx4OldpbmRvd1dpZHRoPjI4Njk1PC94OldpbmRvd1dpZHRoPicsXG4gICAgJyAgICA8L3g6RXhjZWxXb3JrYm9vaz4nLFxuICAgICcgICA8L3htbD4nLFxuICAgICcgIDwhW2VuZGlmXS0tPicsXG4gICAgJyA8L2hlYWQ+J1xuXS5qb2luKFwiXCIpO1xuZXhwb3J0IGRlZmF1bHQgaGVhZDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9jcmV3anMvcmVzL3RwbC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9