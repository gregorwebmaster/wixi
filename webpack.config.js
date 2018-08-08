let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let LiveReloadPlugin = require("webpack-livereload-plugin");
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let shell = require("shelljs");
let path = require('path');

let composer = true;
let production = process.env.NODE_ENV === "production" ? true : false;

production ? console.log("Enable production mode.") : null;

module.exports = () => {
    let workdir = __dirname;

    if (composer && shell.cd("./app/src") && shell.exec("composer install").code !== 0) {
        shell.echo("Error: Can not install composer");
        shell.exit(1);
    }
    if (shell.pwd().stdout != workdir) shell.cd(workdir);

    let templateModules = {
        entry: {
            main: [
                './app/js/main.js',
                './app/scss/main.scss'
            ]
        },

        output: {
            path: __dirname + '/dist/assets/',
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
                        use: [{
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
                                        path.resolve(__dirname + "/app/images")
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
                        path.resolve(__dirname + "./app/images")
                    ]
                },

                {
                    test: /\.eot|ttf|woff|woff2|svg$/,
                    loader: "file-loader",
                    options: {
                        name: "../fonts/[name].[ext]"
                    },
                    include: [
                        path.resolve(__dirname + "/app/fonts"),
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
            new ExtractTextPlugin("[name].css"),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),
            new HtmlWebpackPlugin({
                    chunks: ['main'],
                    inject: 'head',
                    filename: path.resolve(__dirname + '/dist/index.php'),
                    template: path.resolve(__dirname + '/app/index.php')
            }),
            new CopyWebpackPlugin(
                [
                    {
                        from: './app/src/',
                        to: '../',
                        ignore: [
                            '*Test.php',
                            'composer.*',
                            '.gitkeep'
                        ]
                    },
                    {
                        from: './app/images/',
                        to: '../images'
                    }
                ]
            )
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