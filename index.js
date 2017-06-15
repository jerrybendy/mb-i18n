/**
 * Created by jerry on 16/9/13.
 */

/**
 * 加载并解析语言文件, 提供用于访问语言内容的接口
 *
 * @global window.__langPacks 对象。保存所有已经加载的语言包内容
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
var flattenJson = require("./lib/flattenJson");


var $langPacks = {};    // 保存已经注册的所有语言包
var $currentLang = '';   // 当前语言
var $fallbackLang = '';   // 后备语言
var $languageContent = {};  // 当前语言的语言包（Flatten 后的）
var $fallbackLangContent = {};  // 后备语言的语言包


module.exports = {

    /**
     * 初始化多语言库并设置语言内容
     *
     * @param {string} options.lang 当前语言
     * @param {string} options.fallbackLang 可选。后备语言，当前语言中找不到 key 时使用
     * @param {object} options.langPacks 可选。语言包，为空时会使用 window.__langPacks 下的语言
     */
    init: function (options) {
        if (!options.lang) {
            console.warn('[mb-i18n] You must set current language with `lang` when `init()`');
        }

        $currentLang = options.lang;
        if (options.fallbackLang) $fallbackLang = options.fallbackLang;

        if (window.__langPacks && typeof window.__langPacks === 'object') {
            this.registerLanguagePacks(window.__langPacks);
        }

        if (options.langPacks && typeof options.langPacks === 'object')
            this.registerLanguagePacks(options.langPacks);

        // 初始化当前语言
        $languageContent = flattenJson($langPacks[$currentLang] || {});

        // 初始化后备语言
        if ($fallbackLang !== $currentLang) {
            $fallbackLangContent = flattenJson($langPacks[$fallbackLang] || {});
        }
    },


    /**
     * 注册语言包
     *
     * @param {string} langName 语言代码
     * @param {object} langPack 语言包内容
     */
    registerLanguagePack: function (langName, langPack) {
        $langPacks[langName] = langPack;
    },


    /**
     * 批量注册语言包
     *
     * @param {object} langPacks 语言包内容
     */
    registerLanguagePacks: function (langPacks) {
        for (var i in langPacks) {
            if (langPacks.hasOwnProperty(i)) {
                this.registerLanguagePack(i, langPacks[i]);
            }
        }

        return this
    },


    /**
     * 读取并返回语言文本
     *
     * @param {string} textLabel 语言文本的标识
     * @param {string|null} defaultText 可选, 默认显示的内容
     * @param {object|null} paramsMap 参数列表, 对于替换语言中双花括号包围的部分
     * @returns {string}
     */
    t: function (textLabel, defaultText, paramsMap) {
        if (typeof defaultText === "object" && paramsMap == null) {
            paramsMap = defaultText;
            defaultText = null;
        }

        if (defaultText === null || defaultText === undefined) {
            defaultText = textLabel;
        }

        paramsMap = paramsMap || {};

        /*
         * 读取语言包对应的值,
         */
        var text = $languageContent [textLabel] || $fallbackLangContent[textLabel] || defaultText;

        return text.replace(/{{([^}]+)}}/g, function (subStr, match) {
            return paramsMap [match] === undefined ? "" : paramsMap [match];
        });
    },


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
    getLanguagePartial: function (prefix) {
        var self = this;
        return function (textLabel, defaultText, paramsMap) {
            return self.t(prefix + "." + textLabel, defaultText, paramsMap);
        }
    }
};
