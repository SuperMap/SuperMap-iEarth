'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); //可视化依赖

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    },
    module: {

        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.(png|jpe?g|gif|svg|cur)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }

                // loader: 'image-webpack-loader',  //压缩图片
                // options: {
                //   mozjpeg: {
                //     progressive: true,
                //     quality: 50
                //   },
                //   // optipng.enabled: false will disable optipng
                //   optipng: {
                //     enabled: false,
                //   },
                //   pngquant: {
                //     quality: [0.5, 0.65],
                //     speed: 4
                //   },
                //   gifsicle: {
                //     interlaced: false,
                //   },
                //   //ios不支持
                //   // webp: {
                //   //   quality: 100
                //   // }
                // }

            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            
        ]
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    externals: {
        'vue': 'Vue',
        // 'ViewUI': 'view-design',
        // 'axios': 'axios',
        "echarts": "echarts",
    },
    //  启动依赖关系可视化窗口，绑定端口8919
    // plugins: [
    //   new BundleAnalyzerPlugin({ analyzerPort: 8920 }),
    // ]
}
