# 一、简答题

#### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

安装 Webpack
配置文件 webpack.config.js
基本配置：开发模式、项目入口、输出路径等
Loader：不同的预处理资源文件的
Plugin：一些扩展的第三方插件
高级配置：watch、node 等
打包指令

　

　

#### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

Loader 主要是做资源模块的处理，将一些当前环境不支持或者存在兼容问题的资源处理为当前环境支持的资源，比如 ES6 转 ES5 ， Sass Less 编译等等
Plugin 主要根据 webpack 构建过程中不同的阶段做一些额外的动作。比如 拷贝资源文件，清除dist目录等等

Loader
导出一个函数
函数接收一个默认参数 source
函数体内部对 source 进行转换处理
return 返回最终处理之后的结果

Plugin
一个具名 JavaScript 函数
在它的原型上定义 apply 方法
指定一个 webpack 本身的 事件钩子
方法体内通过webpack提供的API获取资源做响应处理
在实现功能后调用 webpack 提供的 callback
　

# 二、编程题

#### 1、使用 Webpack 实现 Vue 项目打包任务

具体任务及说明：

1. 在 code/vue-app-base 中安装、创建、编辑相关文件，进而完成作业。
2. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
3. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
4. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
5. 尽可能的使用上所有你了解到的功能和特性
   const merge = require('webpack-merge')
   const baseConfig = require('./webpack.common')
   const MiniCssExtractPlugin = require('mini-css-extract-plugin')
   const CopyWebpackPlugin = require('copy-webpack-plugin')
   const {CleanWebpackPlugin} = require('clean-webpack-plugin')
   const utils = require('./utils.js')

//yarn add html-webpack-plugin --dev 自动生成HTML插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
//插件加载
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
//打包入口文件
entry: path.join(__dirname,'./src/main.js'),
output: {
//打包输出路径
path: path.join(__dirname,'./dist'),
//输出，
filename: '[name].[hash:6].js'
},
//配置项通过别名来把原导入路径映射成一个新的导入路径
resolve: {
//在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在
extensions: ['.js', '.vue', '.json'],//用于配置在尝试过程中用到的后缀列表
alias: {
'assets':path.join(__dirname,'assets'),
'pages': path.join(__dirname,'src/pages'),
'public':path.join(__dirname,'public'),
'components':path.join(__dirname,'src/components')
}
},
module: {
rules: [
{
//yarn add eslint-loader --dev
test: /\.(js|vue)$/,
use: 'eslint-loader',
enforce: 'pre'
}
]
},

    plugins: [
        //自动生成HTML插件
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new VueLoaderPlugin()
    ]
}

module.exports = merge(baseConfig, {
mode: 'production',
devtool: 'none',
optimization: {
usedExports:true,
minimize:true,
splitChunks: {
cacheGroups: {
commons: {
test: /[\\/]node_modules[\\/]/,
name: 'vendor',
chunks: 'all'
}
}
}
},
module: {
rules: [
{
test: /\.css?$/,
use: [MiniCssExtractPlugin.loader, 'css-loader']
},
{
test: /\.styl(us)?$/,
use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader']
},
{
test: /\.(js|vue)$/,
use: 'eslint-loader',
enforce: 'pre'
}, {
test: /\.less?$/,
use: [
'vue-style-loader',
'css-loader',
'less-loader'
]
} ,{
test: /\.vue$/,
use: 'vue-loader'
}, {
test: /\.js$/,
exclude: /node_modules/,
use: {
loader: 'babel-loader',

        }
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10*1024,
            esModule: false,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        }
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      }
    ]
},
plugins: [
new CleanWebpackPlugin(),
new MiniCssExtractPlugin({
filename: 'main.css'
}),
new CopyWebpackPlugin({
patterns: [
{
from: utils.resolve('public/'),
to: utils.resolve('dist/public'),
toType: 'dir'
}
]
})
]
})


**提示：(开始前必看)**

在视频录制后，webpack 版本以迅雷不及掩耳的速度升级到 5，相应 webpack-cli、webpack-dev-server 都有改变。

项目中使用服务器的配置应该是改为下面这样：

```json
// package.json 中部分代码
"scripts": {
	"serve": "webpack serve --config webpack.config.js"
}
```

vue 文件中 使用 style-loader 即可

其它问题, 可先到 https://www.npmjs.com/ 上搜索查看相应包的最新版本的配置示例, 可以解决大部分问题.



#### 作业要求

本次作业中的编程题要求大家完成相应代码后

- 提交一个项目说明文档，要求思路流程清晰。
- 或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
- 最终将录制的视频或说明文档和代码统一提交至作业仓库。