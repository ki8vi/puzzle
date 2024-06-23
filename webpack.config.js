const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const ESlingPlugin = require('eslint-webpack-plugin');

const config = {
    entry: './src/index.ts',
    mode: 'development',
    // devtool: false,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        assetModuleFilename: 'assets/[name][ext]',
    },
    module: {
        rules: [
            {
                test: /\.[tj]s$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(wav|mp3)$/,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/assets/favicon.ico',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new CopyPlugin({
          patterns: [
            { from: path.resolve(__dirname, 'src/assets/'),
        to: path.resolve(__dirname, 'dist/assets/'),
        // globOptions: {
        //     ignore: ['**/favicon.ico'],
        //   },
        },
       ]
        }),
        new CleanWebpackPlugin(),
        new ESlingPlugin({ extensions: '.ts' }),
    ],
};

module.exports = ({ mode }) => {
    const isProd = mode === 'prod';
    const prodMode = require('./webpack.p.conf');
    const devMode = require('./webpack.d.conf');
    const envConf = isProd ? prodMode : devMode;
    return merge(config, envConf);
};
