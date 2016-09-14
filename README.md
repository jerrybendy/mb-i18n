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


## NOTE

* 语言包的 yml 文件中需要有 lang 字段, 并且值为输出文件名


## HISTORY

### v0.4.0

* 添加 `getLanguagePartial`

### v0.3.0

* `getLanguageText` 方法的第二个参数改为可选
* 不再使用默认语言, 所有语言包独立加载

### v0.2.0

* 添加获取语言文本导出函数

### v0.1.0

* 命令行可用