# mb-i18n-cli


```sh
npm i mb-i18n-cli
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
