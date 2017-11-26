webpack+react多页面应用


## 概述
在 create-react-app 初始化项目结构的基础上，增加webpack打包编译工具，搭建react多页面应用


## 目录结构

```
reactMultiPage/
  README.md 
  package.json
  dist/ 存放编译构建后的文件 ，生产环境使用
  src/ 开发环境目录，只是开发时候使用，上线生产环境不需要打包
    components/ 此文件夹存放公用组件
    public/  此文件夹存放公用图片、css、js等
    page1/ 具体的页面
      App.css
      App.js 
      index.css 
      index.js
    index.html 模板文件，用于编译生成页面    
```

## 注意
1.每个具体页面中必须要有index.js和index.css文件，这2个webpack的入口文件
2.dist为生产目录，非上线不提交

## 使用方法

1、安装新版本node.js

2、全局安装webpack,使系统命令中有webpack命令: npm install webpack -g

3、安装依赖：npm install

4、启动：npm run start （如例子page1这个页面 可以通过浏览器访问 localhost:8181/page1/ 或者localhost:8181/page1/index.html）

5、生产环境：npm run build ；构建完成生成dist文件夹，复制dist文件夹里面的文件到服务器相应的目录即可访问



##nodejs 后台模拟数据服务器相关
在routers文件夹中定义route
使用 app.js启动nodejs web服务

在src/util/connectConfig.js中配置相关域名host和请求路径 ，已配置本地路径