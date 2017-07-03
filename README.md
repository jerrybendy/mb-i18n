# mb-i18n


```sh
npm i mb-i18n
```



## USAGE

```sh
mb-i18n [inputFileGlob] -o [outfilePath] 
```

for example

```sh
mb-i18n src/lang/*.yml -o dist/i18n/
```

combine all language file into a single js file

```sh
mb-i18n src/lang/*.yml -o dist/i18n/ -c lang.js
```

加载和初始化

```js
import i18n from "mb-i18n";

i18n.init({
    lang: 'zh',
    fallbackLang: 'en'
})

console.log(i18n.t("editor.label"));
```


VueJS 2 可以使用 `vue-plugin` 入口注册插件

```js
import mbI18nVuePlugin from 'mb-i18n/vue-plugin'

Vue.use(mbI18nVuePlugin)
```

使用方法

```vue
<template>
    <div>
        <p>{{ $t('foo') }}</p>
        <p>{{ 'bar' | translate }}</p>
    </div>
</template>
<script>
export default {
    created () {
        console.log(this.$i18n.t('baz'))
    }
}
</script>
```


## HISTORY

### v0.7
* `v0.7.2` 简化初始化过程，允许直接在引入语言 JS 文件时指定初始化参数而不必显式的写 `init()` 方法
* `v0.7.1` 使用 Rails 标准的语言格式及变量格式，只支持单一根节点的 yml 文件
* `v0.7.1` 不再使用原来的双花括号的变量语法，全部改为 Rails 的 `${xx}` 格式
* `v0.7.0` 命令行版本生成内容格式改变，使用语言名标识的对象表示语言，允许同时加载多个语言
* `v0.7.0` 命令行版本新增 `-c` 参数，支持打包所有语言到一个 `.js` 文件
* `v0.7.0` API 调整，使用基于注册的语言加载和设置的方式，不再兼容之前的使用方式。添加支持后备语言

### v0.6

* `v0.6.1` 没有默认值时返回语言的 key
* `v0.6.0` 添加对 VueJS 2 的支持

### v0.5

* `v0.5.4` 不再限制每个 .yml 文件都声明一个 lang 对象, lang 不存在时会使用文件名作为语言名
* `v0.5.3` 修复替换参数为 0 或 false 时被替换为空的 bug
* `v0.5.2` 写入 localStorage 时加入是否支持的判断
* `v0.5.1` 修复未加载语言时写入 localStorage 中语言为 undefined 的问题 
* `v0.5.1` 添加 MB 从 APP 中读取语言的方式
* `v0.5.0` 新增多个相同语言的 yml 文件合并到同一个 js 的功能

### v0.4

* 添加 `getLanguagePartial`

### v0.3

* `getLanguageText` 方法的第二个参数改为可选
* 不再使用默认语言, 所有语言包独立加载

### v0.2

* 添加获取语言文本导出函数

### v0.1

* 命令行可用