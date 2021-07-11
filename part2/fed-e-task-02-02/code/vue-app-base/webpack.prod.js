const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");
const { DefinePlugin } = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");

const path = require("path");

//生产环境的配置
module.exports = merge(commonConfig, {
    mode: "production",
    //去除sourceMap
    devtool: "none",

    //输出的文件名
    output: {
        filename: "js/[name].[hash:8].js",
        publicPath: "./"
    },
    //更改css和less的loader
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            favicon: "./public/favicon.ico", // 在此处设置
            //对html代码进行压缩
            minify: {
                removeComments: true, //去注释
                collapseWhitespace: true, //压缩空格
                removeAttributeQuotes: true //去除属性引用
            }
        }),
        new DefinePlugin({
            BASE_URL: process.env.NODE_ENV
        }),
        //用于每次生成的时候，清理上次的打包文件
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash:7].css",
            chunkname: path.posix.join("static", "css/[id].[chunkhash:7].css")
        })
    ],
    optimization: {
        //代码分包
        splitChunks: {
            chunks: "all"
        },
        minimize: true,
        minimizer: [
            //css压缩
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    discardComments: { remove: true } //移除注释
                }
            }),
            new TerserPlugin({
                parallel: true, //开启多线程来提高构建速度
                sourceMap: false,
                terserOptions: {
                    warnings: false, //不展示warning
                    compress: {
                        unused: true, //去除未使用的
                        drop_debugger: true, //移除debugger
                        drop_console: true //去除console
                    },
                    output: {
                        comments: false //去除注释
                    }
                }
            })
        ]
    }
});