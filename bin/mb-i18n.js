#!/usr/bin/env node


'use strict';

var fs    = require('fs');


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


var files = globule.find(inputFiles);


files.forEach(function(fileName) {

    var yml = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));

    if (! yml || ! yml.lang) {
        throw new Error("Language file " + fileName + " must has `lang` field");
    }

    var langName = yml.lang;

    try {

        // 构建目标文本
        var targetContent = "window.langPacks=" + JSON.stringify(yml) + ";";

        // 输出文件
        var targetFilePath = outputPath + langName + ".js";

        fs.writeFile(targetFilePath, targetContent, function(err) {
            if (err) throw err;
        });

    } catch (e) {
        console.log(e);
    }

});



