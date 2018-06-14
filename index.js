/**
 * Created by jerry on 16/9/13.
 */

/**
 * 加载并解析语言文件, 提供用于访问语言内容的接口
 *
 * @global window.__langPacks 对象。保存所有已经加载的语言包内容
 * @global window.__langPackSettings 保存初始化的设置信息
 *
 *
 * 建议的用法:
 * ```js
 *  import i18n from "mb-i18n";
 *
 *  i18n.init({
 *    lang: 'zh',
 *    fallbackLang: 'en'
 *  })
 *
 *  console.log(i18n.t("editor.label"));
 * ```
 */
var $langPacks = {};    // 保存已经注册的所有语言包
var $currentLang = '';   // 当前语言
var $fallbackLang = '';   // 后备语言
var $languageContent = {};  // 当前语言的语言包（Flatten 后的）
var $fallbackLangContent = {};  // 后备语言的语言包


/**
 * 初始化多语言库并设置语言内容
 *
 * @param {string} options.lang 当前语言
 * @param {string} options.fallbackLang 可选。后备语言，当前语言中找不到 key 时使用
 * @param {object} options.langPacks 可选。语言包，为空时会使用 window.__langPacks 下的语言
 */
function init(options) {
    /** @var {{lang, fallbackLang, langPacks}} settings*/
    var settings = assign(options || {}, window.__langPackSettings || {});

    $currentLang = settings.lang || '';
    if (settings.fallbackLang) $fallbackLang = settings.fallbackLang;

    if (window.__langPacks && typeof window.__langPacks === 'object') {
        registerLanguagePacks(window.__langPacks);
    }

    if (settings.langPacks && typeof settings.langPacks === 'object') {
        registerLanguagePacks(settings.langPacks);
    }

    // 初始化当前语言
    $languageContent = flattenJson($langPacks[$currentLang] || {});

    // 初始化后备语言
    if ($fallbackLang !== $currentLang) {
        $fallbackLangContent = flattenJson($langPacks[$fallbackLang] || {});
    }
}


/**
 * 读取并返回语言文本
 *
 * @param {string} textLabel 语言文本的标识
 * @param {string|object|null} defaultText 可选, 默认显示的内容
 * @param {object|null} paramsMap 参数列表, 对于替换语言中双花括号包围的部分
 * @returns {string}
 */
function t(textLabel, defaultText, paramsMap) {
    if (!$currentLang) {
        init({});
    }

    if (typeof defaultText === "object" && paramsMap == null) {
        paramsMap = defaultText;
        defaultText = null;
    }

    if (defaultText == null) {
        defaultText = textLabel;
    }

    paramsMap = paramsMap || {};

    /*
     * 读取语言包对应的值,
     */
    var text = $languageContent [textLabel] || $fallbackLangContent[textLabel] || defaultText;

    return text.replace(/%{([^}]+)}/g, function (subStr, match) {
        return paramsMap [match] === undefined ? "" : paramsMap [match];
    });
}


/**
 * 批量注册语言包
 *
 * @param {object} langPacks 语言包内容
 */
function registerLanguagePacks(langPacks) {
    for (var i in langPacks) {
        if (langPacks.hasOwnProperty(i)) {
            // 当前语言未设置时，使用第一个注册的语言作为主要语言
            if (!$currentLang) {
                $currentLang = i;
            }

            $langPacks[i] = langPacks[i];
        }
    }
}


/**
 * 返回一个函数, 用来包装获取语言包内部的一部分
 *
 * 例如
 *      var _ = i18n.getLanguagePartial("editor");
 *      var txtPreview = _("preview");
 *
 * @param prefix
 * @returns {Function}
 */
function getLanguagePartial(prefix) {
    return function (textLabel, defaultText, paramsMap) {
        return t(prefix + "." + textLabel, defaultText, paramsMap);
    }
}


/**
 * 转换嵌套 json 数据为扁平化 json
 *
 * 代码节选自: https://github.com/hughsk/flat/blob/master/index.js
 * 有删改
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


/**
 * 浅拷贝对象并生成一个新的对象，obj2 的值总是覆盖 obj1
 *
 * @param obj1
 * @param obj2
 * @returns {{}}
 */
function assign(obj1, obj2) {
    var ret = {};
    for (var i in obj1) {
        if (obj1.hasOwnProperty(i)) {
            ret[i] = obj1[i];
        }
    }
    for (var j in obj2) {
        if (obj2.hasOwnProperty(j)) {
            ret[j] = obj2[j];
        }
    }
    return ret;
}


t.init = init
t.t = t
t.getLanguagePartial = getLanguagePartial

if (typeof module !== 'undefined') {
    module.exports = t

} else {
    window.MbI18n = t
}

