/**
 * Created by jerry on 16/9/13.
 */

/**
 * 加载并解析语言文件, 提供用于访问语言内容的接口
 *
 * @global window.lang  保存当前语言的名称, 如 zh-CN
 * @global window.langPacks 对象。保存所有已经加载的语言包内容
 *
 *
 * @export default getLanguageText 获取语言文本
 *
 * 建议的用法:
 * ```js
 *  import __ from "mb-i18n";
 *  console.log(__("editor.label"));
 * ```
 */


var flattenJson = require("./lib/flattenJson");


/**
 * 把语言内容转换成 flatten 格式
 *
 * @var {{lang, rtl}} languageContent
 */
var languageContent = flattenJson(window.langPacks || {});


// 处理 rtl 的语言, 如果设置了 rtl 并且等于 true , 就在 body 上添加对应的类
if (languageContent && languageContent.rtl) {
    document.body.classList.add("rtl");

}

// 把当前语言选项写入 localStorage
window.localStorage.setItem("lang", languageContent.lang);


/**
 * 读取并返回语言文本
 *
 * @param {string} textLabel 语言文本的标识
 * @param {string} defaultText 可选, 默认显示的内容
 * @param {object} paramsMap 参数列表, 对于替换语言中双花括号包围的部分
 * @returns {string}
 */
function getLanguageText (textLabel, defaultText, paramsMap) {

    if (typeof defaultText === "object" && paramsMap == null) {
        paramsMap = defaultText;
        defaultText = "";
    }

    defaultText = defaultText || "";
    paramsMap = paramsMap || {};

    var text;

    /*
     * 读取语言包对应的值,
     */
    text = languageContent [textLabel] || defaultText;

    return text.replace(/{{([^}]+)}}/g, function(subStr, match) {
        return paramsMap [match] || "";
    });
}

module.exports = getLanguageText;