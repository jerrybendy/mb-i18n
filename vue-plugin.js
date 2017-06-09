/**
 *
 * @author    Jerry Bendy
 */

var i18n = require('./index');

var VueI18n = {

    install: function (Vue) {

        Vue.prototype.$i18n = {
            getText: function (key, defaultText, paramsMap) {
                return i18n(key, defaultText, paramsMap);
            },
            getLanguagePartial: i18n.getLanguagePartial
        };

        Vue.filter('translate', function (key) {
            return i18n(key);
        });

        Vue.mixin({
            methods: {
                $t: function (key, defaultText, paramsMap) {
                    return i18n(key, defaultText, paramsMap);
                }
            }
        });
    }
};

module.exports = VueI18n;
