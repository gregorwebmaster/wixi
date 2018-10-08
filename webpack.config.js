let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let LiveReloadPlugin = require("webpack-livereload-plugin");
let HtmlWebpackPlugin = require('html-webpack-plugin');
let shell = require("shelljs");
let path = require('path');

let production = process.env.NODE_ENV === "production" ? true : false;

production ? console.log("Enable production mode.") : null;

module.exports = () => {

    shell.exec("composer install");

    let templateModules = {
        entry: {
            main: [
                './resources/js/main.js',
                './resources/scss/main.scss'
            ]
        },

        output: {
            path: __dirname + '/public/js/',
            filename: '[name].js'
        },

        module: {
            rules: [{
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },

            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: function () {
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                includePaths: [
                                    path.resolve(__dirname, "./node_modules/foundation-sites"),
                                    path.resolve(__dirname, "./node_modules/@fortawesome/fontawesome-free-webfonts"),
                                    path.resolve(__dirname + "/resources/images")
                                ]
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            },

            {
                test: /\.png|jpe?g|gif$/,
                loaders: [{
                    loader: "file-loader",
                    options: {
                        name: "../images/[name].[ext]"
                    }
                },

                    "img-loader"
                ]
            },

            {
                test: /\.svg$/,
                loader: "file-loader",
                options: {
                    name: "../images/[name].[ext]"
                },
                include: [
                    path.resolve(__dirname + "./resources/images")
                ]
            },

            {
                test: /\.eot|ttf|woff|woff2|svg$/,
                loader: "file-loader",
                options: {
                    name: "../fonts/[name].[ext]"
                },
                include: [
                    path.resolve(__dirname + "/resources/fonts"),
                    path.resolve(__dirname + "/node_modules/@fortawesome/fontawesome-free-webfonts")
                ]
            },

            {
                test: /\.js/,
                loader: "babel-loader",
                exclude: /node_modues/
            }
            ]
        },

        plugins: [
            new ExtractTextPlugin("../css/[name].css"),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),
            new HtmlWebpackPlugin({
                chunks: ['main'],
                inject: 'head',
                template: path.resolve(__dirname + '/resources/templates/index.php'),
                filename: path.resolve(__dirname + '/src/templates/index.php')
            })
        ]
    };

    if (production) {
        templateModules.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    screw_ie8: true
                },
                comments: false
            })
        );
    }
    else {
        templateModules.plugins.push(
            new LiveReloadPlugin({
                protocol: "http",
                appendScriptTag: true
            })
        );
    }

    return templateModules;
};