const { src, dest, parallel, series, watch } = require("gulp");

const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();

const browserSync = require("browser-sync");
const bs = browserSync.create();

const del = require("del");

const data = {
  pkg: require("./package.json"),
};

// 样式编译任务
const style = () => {
  // src 第二个参数 { base: "src" }，就是希望按照 src 中的原有目录结构输出
  // gulp-sass 插件的参数 { outputStyle: "expanded" }，控制输出的 css 为展开形式
  // dest 创建文件写入流
  return src("src/assets/styles/*.scss", { base: "src" })
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

// 脚本编译任务
const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

// HTML 的编译任务
const page = () => {
  return src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data: data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
};

// 图片的编译任务
const image = () => {
  return src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

// 字体的编译任务
const font = () => {
  return src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};

const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};

const serve = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );

  bs.init({
    notify: false,
    port: 2080,
    // open: false,
    server: {
      baseDir: ["temp", "src", "public"],
      // 加一个路由，指定 /node_modules 开头的请求，映射到项目根目录的 node_modules 中
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};

const clean = () => {
  return del(["dist", "temp"]);
};

// 修改文件引用，压缩文件
const useref = () => {
  return (
    src("temp/*.html", { base: "temp" })
      .pipe(plugins.useref({ searchPath: ["temp", "."] }))
      // html js css
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true, // 删除换行符
            minifyCSS: true, // 压缩里边的 css
            minifyJS: true, // 压缩里边的 js
          })
        )
      )
      .pipe(dest("dist"))
  );
};

const compile = parallel(style, script, page);

// 上线之前执行的任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);

const develop = series(compile, serve);

module.exports = {
  clean,
  build,
  develop,
};
