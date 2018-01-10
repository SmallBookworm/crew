import head from '../res/tpl'
let downloadMoudle = {};
downloadMoudle.head=head;
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
export default downloadMoudle