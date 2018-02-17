import {Scheduler, downloadMoudle, MataState} from 'crewjs'

let scheduler = new Scheduler(33);

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
    if(mata.state===MataState.FINISH){
        console.log(mata.data);
    }else {
        console.log('fail');
    }
});
scheduler.start();