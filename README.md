# Crew.js
**这是一个用来通过浏览器运行脚本来爬取特定网站的嵌入式爬虫库。使用最新标准的JavaScript语言写成，具有高效，易用的特点。**

## 目录
1. [快速开始](#1)

<h2 id="1">快速开始</h2>

### 1.所需工具
* Node.js
*  Crew.js
* webpack
* Chrome浏览器
### 2.初始化项目
在项目文文件夹中通过npm来初始化项目：

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
或者直接使用全局安装的webpack也可以。引用完毕之后安装：

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
