## 简答题

**1.谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。**

答:1.代码风格的统一，保证项目质量 2.项目开发中大量的机械式工作 3.项目部署便利性，图片等文件的压缩

　

　

**2.你认为脚手架除了为我们创建项目结构，还有什么更深的意义？**

答:提供了项目的规范，重复工作有脚手架完成，利用脚手架快速搭建特定项目结构
　

　

## 编程题

**1.概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具**
 1.npm install yo -- global
 2.创建一个generator-< name > 的文件夹
 3.yarn init 创建一个package.json
 4.安装一个yeoman-generator
 5.根据 generator 目录结构创建目录和文件
 6.通过 yarn link 到全局
 7.在新的工作目录 运行 yo < name >
 8.代码提交到github，yarn publish发布

**2.尝试使用 Gulp 完成项目的自动化构建**  ( **[先要作的事情](./notes/下载包是出错的解决方式.md)** )

(html,css,等素材已经放到code/pages-boilerplate目录)
1.安装 load-grunt-tasks 自动加载所有的 grunt 插件中的任务
2.处理项目中的 css 文件 grunt-sass sass
3.处理项目中的 js 文件 @babel/core @babel/preset-env grunt-babel
4.处理页面中的模板语法 grunt-swigtemplates 将动态数据添加到模板引擎中
5.img 图片,fonts 字体处理 grunt-contrib-imagemin
6.拷贝 public 文件下的所有文件到 dist 目录 grunt-contrib-copy
7.创建编译任务 将处理完的文件集体编译到 dist 目录
8.自动清除 dist 目录下的文件 grunt-contrib-clean
9.启动开发服务器 – grunt-browser-sync 并行执行watch 和 server grunt-concurrent
10.监听文件的变化后自动编译 grunt-contrib-watch
11.处理页面中引用模块 URL 路径问题 grunt-useref grunt-css grunt-contrib-uglify grunt-contrib-concat
12.压缩html grunt-contrib-htmlmin 和 构建build任务


　

　

## 说明：

本次作业中的编程题要求大家完成相应代码后

- 提交一个项目说明文档，要求思路流程清晰。
- 或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
- 说明文档和代码统一提交至作业仓库。