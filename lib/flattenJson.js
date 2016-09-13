/**
 * Created by jerry on 16/8/28.
 */

/**
 * 转换嵌套 json 数据为扁平化 json
 *
 * 代码节选自: https://github.com/hughsk/flat/blob/master/index.js
 * 有删改
 *
 *
 * @param {{object}} target
 * @param {{object}} opts  参数
 *      可选的参数有:
 *          delimiter       分隔符, 默认为点 "."
 *          maxDepth        最大解析深度, 默认不限
 */

function flattenJson (target, opts) {

    opts = opts || {};

    var delimiter = opts.delimiter || ".",
        maxDepth = opts.maxDepth || 0;

    var output = {};


    step(target);

    return output;


    function step(object, prev, currentDepth) {

        currentDepth = currentDepth ? currentDepth : 1;

        Object.keys(object).forEach(function(key) {

            var value = object[key];
            var isarray = opts.safe && Array.isArray(value);
            var type = Object.prototype.toString.call(value);
            var isobject = (
                type === "[object Object]" ||
                type === "[object Array]"
            );

            var newKey = prev
                ? prev + delimiter + key
                : key;

            if (!isarray && isobject && Object.keys(value).length &&
                (!opts.maxDepth || currentDepth < maxDepth)) {
                return step(value, newKey, currentDepth + 1)
            }

            output[newKey] = value
        })
    }
}

module.exports = flattenJson;
