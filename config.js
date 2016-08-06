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

var SpritesmithPlugin = require('webpack-spritesmith');


//源码所在目录位置
const SRC_PATH = path.join(__dirname, 'src');

//发布目录所在位置
const BUILD_PATH = path.join(__dirname, 'build');

// 使用缓存
const CACHE_PATH = path.join(__dirname, 'cache');

//html压缩选项
const minfyHtmlOptions = {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeComments: true
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
            template: 'templates/index.html',
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
        }),
        new SpritesmithPlugin({
            src: {
                cwd: './src/images/icon',
                glob: '*.png'
            },
            target: {
                image: './src/images/sprite/icon.png',
                css: './src/sass/_icon.scss'
            },
            apiOptions: {
                cssImageRef: '../images/sprite/icon.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
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
            test: /\.(css|scss)/,
            loader: TextPlugin.extract('style-loader', 'css-loader!sass')
        },

        {
            test: /\.(jpg|png|gif)$/,
            loaders: ['url-loader?limit=10240&name=assets/[name].[hash:8].[ext]', 'image-webpack']
        },
        {
            test: /\.(js|jsx)$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                cacheDirectory: CACHE_PATH,
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
    sassLoader: {
        sourceComments: true
    },
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