import {Scheduler, downloadMoudle, MataState} from 'crewjs'

let scheduler = new Scheduler(33);
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
            if (mata.state === MataState.FINISH) {
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
    if (mata.state === MataState.FINISH) {
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
        if (mata.state === MataState.FINISH) {
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
    downloadMoudle.downloadFile('ok.xls', downloadMoudle.head + '<body><table>' + table.innerHTML + '</table></body></html>');
});
scheduler.start();