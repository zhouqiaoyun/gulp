'use strict';

//引入gulp依赖包
var gulp = require('gulp');
var sass = require('gulp-sass');//sass的编译
var minifycss = require('gulp-minify-css');//压缩css
var cleanCss = require('gulp-clean-css');//压缩css
var autoprefixer = require('gulp-autoprefixer');//自动添加css前缀
var jshint = require('gulp-jshint');//js代码校验
var uglify = require('gulp-uglify');//压缩js代码
var concat = require('gulp-concat');//合并js文件
var rename = require('gulp-rename');//重命名
var notify = require('gulp-notify');//更改提醒
var cssSprite = require('gulp-css-spritesmith');//css 代码中的切片合并成雪碧图的工具
var spriter = require('gulp-css-spriter');
//var browserSync = require('browser-sync').create();
//var reload= browserSync.reload;
var connect = require('gulp-connect');//使用connect启动一个Web服务器

//引入配置
var path=require('./gulpConfig.js');

//default
   gulp.task('default', ['css','cleanCss','sprite','js'],function(){
   	
 	
   });
   
//实时刷新浏览器
//gulp.task('server', function(){
//	browserSync.init({
//	    server: {
//	      baseDir:["./web"]
//	    }
//	})
//});
//
////监听
//gulp.task("watch",['server'], function(){
//	
// 	gulp.watch('web/static/css/src/*.scss', ['css']);
//  gulp.watch(path.src.sassDest+'*.css', ['cleanCss']);
//  
//  gulp.watch(path.src.minCss+'*.css', ['cleanCss']).on('change', reload);
//  gulp.watch(path.src.jsSrc, ['js']).on('change', reload);
//  gulp.watch("./web/*.html").on('change', reload);
//
//});


gulp.task('connect', function() {
    connect.server({
        host: '', //地址，可不写，不写的话，默认localhost
        port: 3000, //端口号，可不写，默认8000
        root: './web', //当前项目主目录
        livereload: true //自动刷新
    });
});
gulp.task('html', function() {
    gulp.src('web/**/*.html')
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['web/*.html'], ['html']); //监控html文件
    gulp.watch('web/static/css/src/*.scss', ['css']);
    gulp.watch(path.src.sassDest+'*.css', ['cleanCss']);
    
}); 
//执行gulp server开启服务器

gulp.task('server', ['connect', 'watch']);


//css任务
gulp.task('css', function(){
	//sass编译
	return gulp.src('web/static/css/src/*.scss')
	.pipe(sass())
	//指定目录
    .pipe(gulp.dest(path.src.sassDest))
    //添加前缀
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //指定目录
  	.pipe(gulp.dest(path.src.sassDest));
});

//cleanCss任务
gulp.task('cleanCss',function(){
	return gulp.src('web/static/css/dest/*.css')
	 //css代码合并
    .pipe(concat('all.css'))
    //给文件添加.min后缀
    .pipe(rename({ suffix: '.min' }))
    //压缩样式文件
    .pipe(cleanCss({compatibility: 'ie7'}))
    //输出压缩文件到指定目录
    .pipe(gulp.dest(path.src.minCss))

})


 //生成精灵图
gulp.task('sprite', function() {
    return gulp.src('web/static/css/dest/*.css')  //比如recharge.css这个样式里面什么都不用改，是你想要合并的图就要引用这个样式。
        .pipe(spriter({
            // The path and file name of where we will save the sprite sheet
            'spriteSheet': 'web/static/img/dest/spritesheet.png',
            //'spriteSheet': './dist/images/spritesheet.png', //这是雪碧图自动合成的图。 很重要
            // Because we don't know where you will end up saving the CSS file at this point in the pipe,
            // we need a litle help identifying where it will be.
            'pathToSpriteSheetFromCSS': '../../img/dest/spritesheet.png'  //这是在css引用的图片路径，很重要
        }))
        .pipe(gulp.dest('web/static/css/dest/')); //最后生成出来
});


//js任务
gulp.task('js', function() {
    //js代码校验
    return gulp.src(path.src.jsSrc)
        //js检验
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //js代码合并
        .pipe(concat('all.js'))
        //给文件添加.min后缀
        .pipe(rename({suffix: '.min' }))
        //压缩脚本文件
        .pipe(uglify())
        //输出压缩文件到指定目录
        .pipe(gulp.dest(path.src.jsDest))

});
