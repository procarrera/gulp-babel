const { src, dest, watch, task, parallel } = require('gulp');
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

sass.compiler = require("node-sass");

task('default', watchFiles);
task("sass", compileSass);
task("js", compileJs);

function compileJs () {
    return src([
        'originals/*.js'
        ])
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('dist/javascript'));
}

function compileSass() {
    return src("originals/*.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(dest("dist/css"));
}

function watchFiles() {
    watch("originals/*.scss", compileSass);
    watch("originals/*.js", compileJs);
}

exports.build = parallel(compileSass, compileJs);