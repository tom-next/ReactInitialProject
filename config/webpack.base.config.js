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
            output: {
                path: path.join(__dirname, 'dist'),
                filename: '[name].[hash].js'
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader'
                        }
                    },
                    // {
                    //     test: /\.less$/,
                    //     use: [
                    //         'style-loader',
                    //         {
                    //             loader: 'css-loader',
                    //             options: {
                    //                 modules: true,
                    //                 importLoaders: 1,
                    //                 // localIndetName: '[name]__[local]__[hash:base64:5]',
                    //                 localIdentName: '[local]__[hash:base64:5]'
                    //                 // localIndetName: "[name]__[local]___[hash:base64:5]"
                    //             }
                    //         },
                    //         // 'css-loader',
                    //         {
                    //             loader: 'postcss-loader',
                    //             options: {
                    //                 ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                    //                 plugins: () => [
                    //                    require('autoprefixer')({
                    //                         browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
                    //                     }),
                    //                     require('postcss-pxtorem')({ rootValue: 100, propWhiteList: [] })
                    //                 ]
                    //             }
                    //         },
                    //         {
                    //             loader: require.resolve('less-loader'),
                    //             options: {
                    //                 modifyVars: { '@primary-color': '#1DA57A' }
                    //             }
                    //         }
                    //     ]
                    // },
                    {
                        test: /\.less$/,
                        use: [
                            PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: true,
                                    modules: true,
                                    localIdentName: "[local]___[hash:base64:5]"
                                }
                            },
                            {
                               loader: "postcss-loader",
                               options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                            require('autoprefixer')({
                                                browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
                                            }),
                                            require('postcss-pxtorem')({ rootValue: 100, propWhiteList: [] })
                                        ]
                               } 
                            },
                            'less-loader'
                        ]
                    },
                    // {
                    //     test: /\.scss$/,
                    //     use: [
                    //         PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    //         {
                    //             loader: "css-loader",
                    //             options: {
                    //                 sourceMap: true,
                    //                 modules: true,
                    //                 localIdentName: "[local]___[hash:base64:5]"
                    //             }
                    //         },
                    //         'sass-loader'
                    //     ]
                    // },
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