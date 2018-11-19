const webpack = require('webpack');
const merge = require("webpack-merge");
const path = require("path")
// 将生成的css提取到一个名为main.css的单独模块中  
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin'); // Add this in top

const APP_DIR = path.resolve(__dirname, '../src');
module.exports = env => {
    const { PLATFORM, VERSION } = env;
    return merge([
        {
            entry: ['@babel/polyfill', APP_DIR],
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader'
                        }
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            PLATFORM === 'production' ? new MiniCssExtractPlugin({
                                filename: '[name].css',
                                chunkFilename: '[id].css'
                            }) : 'style-loader',
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: true,
                                    modules: true,
                                    localIdentName: "[local]___[hash:base64:5]"
                                }
                            },
                            'sass-loader'
                        ]
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10000,    // 小于10000kb自动转base64
                            name: 'static/images/[name].[hash:7].[ext]'
                        }
                    },
                    {
                        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:7].[ext]'
                        }
                    },
                    {
                        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'static/font/[name].[hash:7].[ext]'
                        }
                    },
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: './src/index.html',
                    filename: './index.html'
                }),
                new webpack.DefinePlugin({
                    'process.env.VERSION': JSON.stringify(env.VERSION),
                    'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
                }),
                new CopyWebpackPlugin([{ from: 'src/static' }]),
            ],
        }
    ])
};