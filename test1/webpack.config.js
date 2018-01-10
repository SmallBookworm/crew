module.exports={
    devtool: "inline-source-map",
    entry: __dirname+"/main.js",
    output: {
        path: __dirname,
        filename: "runtime.js"
    }
};