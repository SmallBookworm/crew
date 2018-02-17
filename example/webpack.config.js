module.exports={
    devtool: "inline-source-map",
    entry: __dirname+"/index.js",
    output: {
        path: __dirname,
        filename: "runtime.js"
    }
};