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
 */

function flattenJson (target) {

    var output = {};

    step(target);

    return output;


    function step(object, prev) {

        Object.keys(object).forEach(function(key) {

            var value = object[key];
            var type = Object.prototype.toString.call(value);
            var isObject = (
                type === "[object Object]" ||
                type === "[object Array]"
            );

            var newKey = prev
                ? prev + "." + key
                : key;

            if (isObject && Object.keys(value).length) {
                return step(value, newKey)
            }

            output[newKey] = value
        })
    }
}

module.exports = flattenJson;
