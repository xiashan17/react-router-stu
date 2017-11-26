const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');//清除编译文件
// console.log("process.env.NODE_ENV="+process.env.NODE_ENV );
const NODE_ENV = process.env.NODE_ENV || 'development'
const BUILD_PATH = 'dist';


const vendors = [
  'babel-polyfill', //ie9以及以上浏览量中支持promise等异步流程处理API
  'react',
  'react-dom',
  'react-redux',
  'redux',
  'redux-thunk',
  'axios',
  'lodash'
];
const __PROD__ = NODE_ENV === 'production';

const extractCSS = new ExtractTextPlugin(__PROD__ ? "statics/css/[name].[chunkhash:6].css" : "[name].[chunkhash:6].css");

const webpackConfig = {
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],//为了减少搜索我们直接写明node_modules的全路径
    // mainFields: ['jsnext:main','main']            //这样就可以优化支持tree-shaking的库 ,部分库更新导致找不到文件，暂停这个优化
  },
  entry: {
    app: './src/app.js',
    vendors: vendors
  },
  output: {
    path: path.resolve(__dirname, './' + BUILD_PATH + '/'),
    publicPath: '/',
    filename: __PROD__ ? 'statics/js/[name].[chunkhash:6].js' : '[name].[chunkhash:6].js'
  },
  devtool: 'source-map',
  devServer: {
    compress: true,
    inline: true,
    port: 8181,
    proxy: {
      "/api": {
        target: "http://localhost:3333",  //代理3333端口本地node服务
        pathRewrite: { "^/api": "" }      //重写服务以/api为基本路径
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        include: [
          // 只去解析运行目录下的 src
          path.resolve(__dirname, "src")
        ],
        use: [{
          loader: 'babel-loader?cacheDirectory=true'
        }]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader" })
      },
      //生产环境压缩css
      // {
      //   test: /\.css$/,
      //   use: ExtractTextPlugin.extract({
      //     fallback: "style-loader",
      //     use: [
      //       {
      //         loader: 'css-loader',
      //         options: {
      //           minimize: true //css压缩
      //         }
      //       }
      //     ]
      //   })
      // },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)$/,
        // 图片加载器，较小的图片转成base64
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: __PROD__ ? 'statics/images/[name].[ext]?[hash:7]' : '[name].[ext]?[hash:7]'
        }
        //这里涉及到了4个参数：limit、name、outputPath、publicPath。其中limit已经说明过。file-loader相关的是name、outputPath和publicPath
        //  use: 'url-loader?limit=1024&name=[path][name].[ext]&outputPath=img/&publicPath=output/', 
      }
    ]
  },
  plugins: [
    //moment 2.18 会将所有本地化内容和核心功能一起打包（见该 GitHub issue）。你可使用 IgnorePlugin 在打包时忽略本地化内容:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // 提取公共模块,忽略UI组件中的css文件，忽略非node_modules中的第3方资源
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 公共模块的名称
      minChunks: function (module) {
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    })
    //提取样式
    // ,extractCSS

  ],
};


//生产环境
if (__PROD__) {
  webpackConfig.plugins = webpackConfig.plugins.concat([
    //清空目录
    new CleanWebpackPlugin([BUILD_PATH], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    //标记一些变量为全局变量,
    //process.env给一些插件提供全局变量，一些插件根据环境给予判断运行和制定资源 必要
    //SERVICE_URL 给予不同个URL，一些不能通过改host的时候直接替换url
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      },
      'SERVICE_URL': JSON.stringify("http://production.example.com")
    }),
    //压缩js插件
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告  
        warnings: false,
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true,
      }
    }),
    //它用于将 webpack 1 迁移至 webpack 2，对于暂时不支持loader的options的属性，使用此插件
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    //通过模块调用次数给模块分配ids，常用的ids就会分配更短的id，使ids可预测，减小文件大小，推荐使用
    new webpack.optimize.OccurrenceOrderPlugin(true)
    , extractCSS
  ]);
}

//构建html的plugin
const htmlPlugin = new HtmlWebpackPlugin({
  title: 'react-router',
  filename: 'index.html',
  template: './src/index.html',
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  },
  chunks: ['manifest', 'vendors', newname]
})
webpackConfig.plugins.push(htmlPlugin);

module.exports = webpackConfig;
