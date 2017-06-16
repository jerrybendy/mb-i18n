#!/usr/bin/env node


'use strict';

var fs = require('fs');
var path = require('path');
var yargs = require('yargs')
    .option('output', {
        alias: 'o',
        describe: 'Specified the output file path'
    })
    .option('combine', {
        alias: 'c',
        describe: 'Combine all language file into a single file, specified the file name'
    })
    .demandOption('output')
    .help('h')
    .argv;


var outputPath = yargs.output;
var inputFiles = yargs._;

if (outputPath [outputPath.length] !== "/") {
    outputPath += "/";
}


var globule = require("globule");
var yaml = require("js-yaml");

// 判断目标目录, 如果不存在就创建
if (!fs.existsSync(outputPath)) {
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


files.forEach(function (fileName) {

    var yml = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));

    if (!yml) {
        throw new Error("Load yml file error: " + fileName);
    }

    var langName = yml.lang || path.basename(fileName, path.extname(fileName));

    // 保存语言内容到 langPacks,
    // 只进行浅拷贝
    langPacks [langName] = Object.assign({}, (langPacks [langName] || {}), yml);
});


/*
 * 判断对文件语言内容的后续处理方式，如果是合并
 */

var preTemplate = '(function(w){var n="__langPacks";w[n]=w[n]||{};',
    postTemplate = '})(window);';


if (yargs.combine) {
    var combineFileName = typeof yargs.combine === 'string' ? yargs.combine : 'languages.js';

    try {
        // 构建目标文本
        var _targetContent = preTemplate +
            'w[n]=' +
            JSON.stringify(langPacks) +
            postTemplate;

        fs.writeFileSync(outputPath + combineFileName, _targetContent);

    } catch (e) {
        console.log(e);
    }

} else {

    // 从 langPacks 中循环， 输出文件
    for (var langName in langPacks) {
        var content = langPacks [langName];

        try {
            // 构建目标文本
            var targetContent = preTemplate +
                'w[n]["' + langName + '"]=' +
                JSON.stringify(content) +
                postTemplate;

            // 输出文件
            var targetFilePath = outputPath + langName + ".js";

            fs.writeFileSync(targetFilePath, targetContent);

        } catch (e) {
            console.log(e);
        }
    }
}

process.exit(0);
