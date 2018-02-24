# Crew.js
**这是一个用来通过浏览器运行脚本来爬取特定网站的嵌入式爬虫库。使用最新标准的JavaScript语言写成，具有高效，易用的特点。**

## 目录
1. [快速开始](#1)
2. [框架结构](#2)
3. [待解决的问题](#3)

<h2 id="1">快速开始</h2>

*整个项目在example文件夹中*
### 1.所需其它工具
* Node.js
* webpack
* Google Chrome
### 2.初始化项目
在项目文文件夹中通过npm来初始化项目，在终端中进入项目文件夹后运行：

    npm init
配置好以后创建index.js。
### 3.引用库
 首先在package.json中依赖crew：

      "dependencies": {
        "crewjs": "file:../crewjs"
      }
 这里由于包在本地故通过相对路径引用。使用webpack来进行打包：

      "devDependencies": {
        "webpack": "^3.10.0"
      }
或者直接使用全局安装的webpack也可以。引用完毕之后在终端中运行安装命令：

    npm install
### 4.webpack配置
创建webpack配置文件webpack.config.js，只需要简单的配置输入输出文件，并且devtool配置为行内形式，使source-map内嵌方便在浏览器内调试：

    module.exports={
        devtool: "inline-source-map",
        entry: __dirname+"/index.js",
        output: {
            path: __dirname,
            filename: "runtime.js"
        }
    };
### 5.创建爬虫
打开index.js文件，导入用到的库：

    import {Scheduler, downloadMoudle, MataState} from 'crewjs'
创建爬虫对象：

    let scheduler = new Scheduler(33);
创建爬取函数：

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
初始化爬虫对象：

    scheduler.init(createPromise,function (id) {
        let mata=scheduler.getMata(id);
        if(mata.state===MataState.FINISH){
            console.log(mata.data);
        }else {
            console.log('fail');
        }
    });
开始爬取：

    scheduler.start();
### 6.编译打包
使用webpack生成runtime文件，在终端中输入：

    webpack
### 7.运行爬虫
运行Chrome，在相关页面打开开发者工具将生成的runtime文件代码复制到console中运行。

<h2 id="2">框架结构</h2>

<h2 id="3">待解决的问题</h2>

- [ ] 事件系统
- [ ] text1中每个mata在爬取到数据后就处理完数据，如果要严格按数据顺序应该在所有数据爬取后处理，后续例子中应体现
- [ ] 重复尝试功能
- [ ] HTTP库
- [ ] 自动运行
- [ ] 自动爬取功能