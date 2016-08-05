'use strict';


let path = require('path');

let webpack = require('webpack');

/**
 * 提供支持使用 require 加载模块
 * @type {BowerWebpackPlugin}
 * link: https://github.com/lpiepiora/bower-webpack-plugin
 */
let BowerWebpackPlugin = require('bower-webpack-plugin');

/**
 * 用作单独打包文本文件,如css文件
 * @type {ExtractTextPlugin}
 * link: https://github.com/webpack/extract-text-webpack-plugin
 */
let TextPlugin = require('extract-text-webpack-plugin');

/**
 * 用来创建HTML文件
 * link: https://github.com/ampedandwired/html-webpack-plugin
 * @type {HtmlWebpackPlugin}
 */
let HtmlPlugin = require('html-webpack-plugin');

//源码所在目录位置
const SRC_PATH = path.join(__dirname, 'src');

//发布目录所在位置
const BUILD_PATH = path.join(__dirname, 'build');

//html压缩选项
const minfyHtmlOptions = {
    collapseWhitespace: true, //删除空格
    removeComments: true //删除注释
};

/**
 * 创建html页面
 * @param options
 * @returns {HtmlWebpackPlugin}
 */
function createPage(options) {
    let o = Object.assign({
        title: 'undefined title',
        inject: 'body'
    }, options || {});
    if (o.template) o.template = path.join(SRC_PATH, o.template);
    if (o.minify) o.minify = minfyHtmlOptions;
    return new HtmlPlugin(o);
}


let config = {
    pages: [
        {
            title: 'hello world',
            template: 'templates/base.html',
            filename: 'index.html',
            chunks: ['app', 'lib'],
            minify: true
        }
    ],
    entry: {
        app: path.join(SRC_PATH, 'app.js'),
        lib: ['react', 'react-dom', 'react-router']
    },
    output: {
        path: BUILD_PATH,
        publicPath: '/',
        filename: 'assets/[name].[hash:8].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json']
    },
    plugins: [
        new TextPlugin('assets/[name].[hash:8].css'),
        new webpack.optimize.CommonsChunkPlugin('lib', 'assets/lib.[hash:8].js'),
        new BowerWebpackPlugin({
            searchResolveModulesDirectories: false
        })
    ],
    eslint: {
        configFile: '.eslintrc'
    },
    preLoaders: [
        {
            test: /\.(js|jsx)$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
        }
    ],
    loaders: [
        {
            test: /\.(css|scss)$/,
            //单独打包css文件用
            loader: TextPlugin.extract('style-loader', 'css-loader', 'sass-loader')
        },
        {
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader?limit=10240&name=assets/[name].[hash].[ext]'
        },
        {
            test: /\.(js|jsx)$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['react', 'es2015']
            }
        },
        {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loaders: ['url-loader?limit=10240&name=assets/[name].[ext]']
        },
        {
            test: /\.json$/,
            loader: 'json-loader'
        }
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        proxy: {
            /*
             '/h5app/*': {
             target: 'http://m.pala-pala.com',
             secure: false
             }
             */
        }
    }

};

config.pages.forEach(page => config.plugins.push(createPage(page)));

delete config.pages;

module.exports = config;