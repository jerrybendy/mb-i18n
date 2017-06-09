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
        console.log(this.$i18n.getText('baz'))
    }
}
</script>
```

## NOTE

* 语言包的 yml 文件中需要有 lang 字段, 并且值为输出文件名


## HISTORY

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