//引入gulp commom.js
const gulp = require('gulp')


//引入压缩css代码的依赖
const cssmin = require('gulp-cssmin')

//引入自动加前缀依赖
const autoprefixer = require('gulp-autoprefixer')

//引入压缩sass依赖
const sass = require('gulp-sass')

//引入压缩js依赖
const uglify = require('gulp-uglify')

//引入兼容转翻译插件
const babel = require('gulp-babel')

//引入压缩html依赖
const html = require('gulp-htmlmin')

//引入托管服务
const webServer = require('gulp-webserver')

//引入清除
const clean = require('gulp-clean')




//制定任务css
gulp.task('css', () => gulp
    .src("./src/css/**")/*压缩src下css里面所有文件 */
    .pipe(autoprefixer({
        overrideBrowserslist: [
            "> 1%",//全球使用情况统计选择的浏览器版本
            "last 2 versions"//每个浏览器的最后两个版本
        ]
    }))
    .pipe(cssmin())//管道
    .pipe(gulp.dest("./dist/css"))//制定压缩后放哪
)

//制定任务sass
gulp.task('sass', () => gulp
    .src('./src/sass/**')
    .pipe(sass())
    .pipe(autoprefixer({
        overrideBrowserslist: [
            "> 1%",
            "last 2 versions"
        ]
    }))
    .pipe(cssmin())
    .pipe(gulp.dest("./dist/sass"))
)

//制定任务js
gulp.task('js', () => gulp
    .src('./src/js/**')
    .pipe(babel({
        presets: ["@babel/preset-env"]//babel预设 将语法转化成当前浏览器兼容的代码
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
)

//制定任务html
gulp.task('html', () => gulp
    .src('./src/pages/**')
    .pipe(html({
        removeEmptyAttibutes: true, // 移出所有空属性
        collapseWhitespace: true, // 压缩 html
        /*   minifyJS: true,
          minifyCSS: true */
    }))
    .pipe(gulp.dest('./dist/pages'))
)

//处理静态资源
gulp.task('assets', () =>
    gulp.src('./src/assets/**')
        .pipe(gulp.dest('./dist/assets'))
)



//托管服务(类似开发模式),自动打开网页
gulp.task('webServer', () => gulp
    .src('./dist')
    .pipe(webServer({
        host: 'localhost',
        port: 4000,
        livereload: true,
        open: './pages/university.html'
    }))
)

//清除文件clean
gulp.task('clean', () =>
    gulp.src('./dist')
        .pipe(clean())
)

//观察代码变化
gulp.task('watch', () =>
    gulp.watch('./src/**', gulp.series('css', 'sass', 'js', 'html', 'assets', 'clean', (done) => {
        console.log('更新over');
        done()
    }))
)

//批量处理
gulp.task('default',
    gulp.series('css', 'sass', 'js', 'html', 'assets', 'webServer', 'watch',(done) => {
        console.log('批量处理over');
        done()
    }))

