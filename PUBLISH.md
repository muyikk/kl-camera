## Publish

发布之前需要在 app.module.ts 文件中将导出内容重命名为自定义名称；

1.首先执行

```bash
$ npm run build
```

项目文件夹下会生成 dist 文价夹

2.修改 package.json 中的版本号/修改项目名称(第一次)

3.执行

```bash
$ npm publish --access=public
```

发布最新内容到 npm
