'use strict';


let path = require('path');

let webpack = require('webpack');

let webPackConfig = require('./config');

/**
 * 获取命令行参数数数组
 * 关于minimist模块说明请参考：https://github.com/substack/minimist
 **/
let args = require('minimist')(process.argv.slice(2));

//定义支持的运行环境: 开发环境,生产环境,测试环境
const ALLOW_ENVS = ['dev', 'build', 'test'];


/**
 * 获取当前是属于那个环境
 * @returns {*}
 */
function getEnv() {
    var env;
    if (args._.length > 0 && args._.indexOf('start') !== -1) {
        env = 'test';
    } else if (args.env) {
        env = args.env;
    } else {
        env = 'dev';
    }
    return env;
}

/**
 * 根据当前环境获取配置
 * @param curEnv
 * @returns {*}
 */
function createConfig(curEnv) {
    let isValid = curEnv && curEnv.length > 0 && ALLOW_ENVS.indexOf(curEnv) !== -1;
    let validEnv = isValid ? curEnv : 'dev';
    let config = {};
    switch (validEnv) {
        case 'dev':
            config = Object.assign({
                cache: true,
                devtool: 'eval-source-map'

            }, webPackConfig);
            config.module = {
                preLoaders: webPackConfig.preLoaders,
                loaders: webPackConfig.loaders
            };
            //允许错误不打断程序，官方说明：http://webpack.github.io/docs/list-of-plugins.html
            config.plugins.push(new webpack.NoErrorsPlugin());
            break;
        case 'build':
            config = Object.assign({
                cache: false,
                devtool: false
            }, webPackConfig);

            config.module = {
                loaders: webPackConfig.loaders
            };

            config.plugins = config.plugins.concat([
                new webpack.optimize.DedupePlugin(),
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': '"production"'
                }),
                new webpack.optimize.UglifyJsPlugin({
                    output: {
                        comments: false  // remove all comments
                    },
                    compress: {
                        warnings: false
                    }
                }),
                new webpack.optimize.OccurenceOrderPlugin(),
                new webpack.optimize.AggressiveMergingPlugin(),
                new webpack.NoErrorsPlugin()
            ]);

            break;
        case 'test':
            config = {
                devtool: 'inline-source-map',
                module: {
                    loaders: webPackConfig.loaders
                },
                resolve: {
                    extensions: ['', '.json', '.js']
                },
                plugins: [
                    new webpack.NoErrorsPlugin()
                ]
            };
            break;
    }

    delete config.preLoaders;
    delete config.loaders;

    return config;
}


process.env.REACT_WEBPACK_ENV = getEnv();


module.exports = createConfig(process.env.REACT_WEBPACK_ENV);

