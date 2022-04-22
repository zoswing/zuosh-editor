# 项目编辑器

包含文件导航区、代码编辑区等

## 开发

```shell

npm i

npm  run dev


```

### 打包

```shell
npm run build
```

### 发布

当前目录下，单独发布

```shell
npm run release
tnpm publish
git push
git push --tag
```

【推荐】根目录使用`lerna`发布，包名称： `@tencent/qqminiappeditor`

```shell
npm run init
npm run build:editor
lerna publish
```

镜像地址： [内部 npm 服务](https://mirrors.tencent.com/#/private/npm/detail?repo_id=537&project_name=%40tencent%2Fqqminiappeditor&search_label=package_name&search_value=qqminiappeditor&page_num=1)

## 使用

### 安装

```shell
tnpm install @tencent/vos.plugin.editor
```

### 引入组件

引用的工程需要使用`monaco-editor-webpack-plugin`插件。

```js
const Demo = () => {
  return <ProjectEditor {...props} />
}
```

### props 属性

| 属性名 | 是否必填 | 描述 |
| ------ | -------- | ---- |
| 单元格 | 单元格   | desc |
