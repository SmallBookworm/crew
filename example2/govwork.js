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
        if (this.bundle)
            this.bundle(this.id)
    }

    finish(res) {
        this.data = res;
        this.state = FINISH;
        if (this.bundle)
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

class Listener {
    constructor(mataPool) {
        this._mataPool = mataPool;
    }

    setEndFunction(func) {
        if (this._waitingPool.length === 0 && this._doingPool.length === 0 && this.endFunction)
            this.endFunction();
    }
    setStartFunction() {
        if (this._waitingPool.length === 0 && this._doingPool.length === 0 && this.endFunction)
            this.endFunction();
    }
}


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
        //this.eventListen=new Listener(this);
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


let downloadMoudle = {};
downloadMoudle.head = head;
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

const MataState = { WAIT: WAIT, DOING: DOING, FINISH: FINISH, FAIL: FAIL };



//main

let scheduler = new Scheduler(15);




function factory(url) {
    /**
     * @returns {Promise}
     **/
    return function () {
        let xhr = new XMLHttpRequest();
        return new Promise(function (resolve, reject) {
            //method，address，async
            xhr.overrideMimeType('text/html; charset=gb2312');
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
        });
    }
}

function getPage(href, j, title, result) {
    let url = href.split('.shtml')[0] + '_' + j + '.shtml';
    return scheduler.push(factory(url), function (id) {
        let mata = scheduler.getMata(id);
        if (mata.state === MataState.FINISH) {
            let doc = mata.data;

            if (doc.getElementById('articleText')) {

                let content = doc.getElementById('articleText').innerText;

                result += content;
                getPage(href, j + 1, title, result);
            } else {
                console.log('can not get text')
                downloadMoudle.downloadFile(title + '.txt', result);
            }

        } else {
            console.log('fail');
            downloadMoudle.downloadFile(title + '.txt', result);
        }

    })
}

let listas = document.getElementsByClassName('lista');
for (let lista of listas) {
    let listaname=lista.getElementsByTagName('a')[0].title;
    let href = [];
    let aelements = lista.getElementsByTagName('a');
    for (let i = 0; i < aelements.length; i++) {
        if (!aelements[i].href.includes("zg"))
            href.push(aelements[i].href)
    }

    for (let i = 0; i < href.length; i++) {
        scheduler.push(factory(href[i]), function (id) {
            let mata = scheduler.getMata(id);
            if (mata.state === MataState.FINISH) {
                let doc = mata.data;


                console.log('1')
                let textelement = doc.getElementById('articleText');
                if (textelement) {
                    while (textelement.firstChild.tagName == "STYLE")
                        textelement.removeChild(textelement.firstChild);
                    let result = textelement.innerText;
                    let title = i == 0 ? doc.getElementById('articleTitle').innerText : listaname+doc.getElementById('articleTitle').innerText;


                    getPage(href[i], 1, title, result)


                }

            } else {
                console.log('fail')
            }

        })
    }

}


scheduler.setEndFunction(function () {
    console.log('finish')
});
scheduler.start();