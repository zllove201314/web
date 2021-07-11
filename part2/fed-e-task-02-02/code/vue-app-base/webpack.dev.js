const commonConfig = require("./webpack.common");
const { DefinePlugin } = require("webpack");

const { merge } = require("webpack-merge");

module.exports = merge(commonConfig, {
    //开发环境
    mode: "development",
    //指定sourceMap
    devtool: "#@cheap-module-source-map",
    module: {
        rules: [
            {
                test: /\.less$/,
                //对于less代码，我们需要使用less-loader来转换，然后再用css-loader 和 vue-style-loader
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.css$/,
                //这个是用来转换vue中的style标签和css文件的
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new DefinePlugin({
            //定义BASE_URL index.html中需要使用
            BASE_URL: "/public/"
        })
    ]
});