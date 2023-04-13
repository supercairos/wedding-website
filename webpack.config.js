const path = require('path');
const webpack = require('webpack');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const mergeJSON = require('handlebars-webpack-plugin/utils/mergeJSON');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const RobotsTxtPlugin = require("robotstxt-webpack-plugin");
const CnameWebpackPlugin = require('cname-webpack-plugin');


// Project config data.
// Go here to change stuff for the whole demo, ie, change the navbar.
// Also go here for the various data loops, ie, category products, slideshows
const projectData = mergeJSON(path.join(__dirname, '/src/data/**/*.json'));


// paths used in various placed in webpack config
const paths = {
    src: {
        imgs: './src/assets/images',
        scss: './src/assets/scss',
        fonts: './src/assets/fonts',
        js: './src/assets/js',
        svgs: './src/assets/svgs',
        video: './src/assets/video',
        favicon: './src/assets/favicon',
    },
    dist: {
        imgs: './assets/images',
        css: './assets/css',
        fonts: './assets/fonts',
        js: './assets/js',
        svgs: './assets/svgs',
        video: './assets/video',
        favicon: './assets/favicon',
    }
}

// Main webpack config options.
const wPackConfig = {
    entry: {
        'libs': [paths.src.scss + '/libs.scss'],
        'theme': [paths.src.js + '/theme.js', paths.src.scss + '/theme.scss'],
        'wishlist': [paths.src.js + '/pages/wishlist.js'],
        'contact': [paths.src.js + '/pages/contact.js'],
        'password': [paths.src.js + '/pages/password.js'],
    },
    output: {
        filename: paths.dist.js + '/[name].bundle.js',
    },
    devtool: 'source-map',
    mode: 'development',
    target: 'web',
    resolve: {
        alias: {
            'handlebars': 'handlebars/dist/handlebars.js',
        }
    },
    externals: {
        paypal: 'PayPal'
    },
    module: {
        rules: [{
            test: /\.(sass|scss|css)$/,
            include: path.resolve(__dirname, paths.src.scss.slice(2)),
            use: [{
                loader: MiniCssExtractPlugin.loader,
            },
            {
                loader: 'css-loader',
                options: {
                    url: false,
                    // sourceMap: true,
                },
            },
            {
                loader: 'postcss-loader'
            },
            {
                loader: 'sass-loader',
                // options: {
                //     sourceMap: true,
                //     sassOptions: {
                //         indentWidth: 4,
                //         outputStyle: 'expanded',
                //         sourceComments: true
                //     }
                // }
            },
            ],
        },]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/](node_modules)[\\/].+\.js$/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new CssMinimizerPlugin(),
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CopyPlugin({
            patterns: [{
                from: paths.src.fonts,
                to: paths.dist.fonts,
                noErrorOnMissing: true
            },
            {
                from: paths.src.imgs,
                to: paths.dist.imgs,
                noErrorOnMissing: true
            },
            {
                from: paths.src.favicon,
                to: paths.dist.favicon,
                noErrorOnMissing: true
            },
            {
                from: paths.src.svgs,
                to: paths.dist.svgs,
                noErrorOnMissing: true
            },
            {
                from: paths.src.video,
                to: paths.dist.video,
                noErrorOnMissing: true
            }
            ],
        }),
        new HandlebarsPlugin({
            entry: path.join(process.cwd(), 'src', 'html', '**', '*.html'),
            output: path.join(process.cwd(), 'dist', '[name].html'),
            partials: [path.join(process.cwd(), 'src', 'partials', '**', '*.{html,svg}')],
            data: projectData,
            helpers: {
                webRoot: function () {
                    return '.';
                },
                config: function (data) {
                    return data;
                },
                ifEquals: function (arg1, arg2, options) {
                    if (arg1 === arg2) {
                        return options.fn(this);
                    }
                    return options.inverse(this);
                },
                log: function (data) {
                    console.log(data);
                },
                limit: function (arr, limit) {
                    if (!Array.isArray(arr)) { return []; }
                    return arr.slice(0, limit);
                },
                deadline: function (date) {
                    const deadline = new Date(date);
                    const today = new Date();
                    const diff = deadline.getTime() - today.getTime();
                    const days = Math.ceil(diff / (1000 * 3600 * 24));
                    return days;
                }
            },
            // onBeforeSave: function(Handlebars, res, file) {
            //     const elem = file.split('//').pop().split('/').length;
            //     return res.split('.').join('.'.repeat(elem));
            // },
        }),
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({
            filename: paths.dist.css + '/[name].bundle.css',
        }),
        new RobotsTxtPlugin({
            policy: [
                {
                    userAgent: '*',
                    disallow: '/',
                }
            ],
        }),
        new CnameWebpackPlugin({
            domain: 'clarisseetromain.fr',
        }),
    ]
};

module.exports = wPackConfig;