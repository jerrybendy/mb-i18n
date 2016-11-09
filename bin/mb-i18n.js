#!/usr/bin/env node


'use strict';

var fs    = require('fs');
var path  = require('path');


var argv = process.argv;

// 去掉 argv 的前两个值
argv.shift();
argv.shift();


// 判断倒数第二个参数是否是 -o
if (argv [argv.length - 2] !== "-o") {
    console.log("need outfile specified (-o)");
    process.exit(1);
}

var outputPath = argv [argv.length - 1];
var inputFiles = argv.slice(0, argv.length - 2);

if (outputPath [outputPath.length] !== "/") {
    outputPath += "/";
}


var globule = require("globule");
var yaml = require("js-yaml");

// 判断目标目录, 如果不存在就创建
if (! fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}


/**
 * glob 查找符合条件的所有文件
 */
var files = globule.find(inputFiles);

/**
 * 保存所有已经加载的语言内容
 */
var langPacks = {};


files.forEach(function(fileName) {

    var yml = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));

    if (! yml) {
        throw new Error("Load yml file error: " + fileName);
    }

    if (! yml.lang) {
        yml.lang = path.basename(fileName, path.extname(fileName));
    }

    var langName = yml.lang;

    // 保存语言内容到 langPacks,
    // 只进行浅拷贝
    langPacks [langName] = Object.assign({}, (langPacks [langName] || {}), yml);

});


// 从 langPacks 中循环， 输出文件
for (var langName in langPacks) {
    var content = langPacks [langName];

    try {
        // 构建目标文本
        var targetContent = "window.langPacks=" + JSON.stringify(content) + ";";

        // 输出文件
        var targetFilePath = outputPath + langName + ".js";

        fs.writeFileSync(targetFilePath, targetContent);

    } catch (e) {
        console.log(e);
    }
}

process.exit(0);



