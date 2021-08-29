import type * as webpack from 'webpack';
import * as path from 'path';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode: 'development' | 'production' = (process.env.NODE_ENV as any) || 'development';
const prod = mode === 'production';

const config: webpack.Configuration & WebpackDevServerConfiguration = {
    target: 'web',
    mode,
    entry: {
        bundle: ['./src/bootstrap.ts']
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].[hash].js',
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.ts', '.mjs', '.js', '.json', '.svelte'],
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    devServer: {
        hot: false
    },
    module: {
        rules: [
            {
                test: /\.worker\.ts$/, // ts结尾,这也很重要
                use: [
                    {
                        loader: 'workerize-loader',
                        options: {
                            import: false
                        }
                    }
                ],

            },
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: prod,
                        hotReload: !prod,
                        preprocess: require('svelte-preprocess')({})
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    prod ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
                ]
            },
            {
              test: /\.s[ac]ss$/i,
              use: [
                // Creates `style` nodes from JS strings
                prod ? MiniCssExtractPlugin.loader : 'style-loader',
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
              ],
            },
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',

                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
			filename: '[hash].css'
		}),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: '/index.html'
        })
    ],
    devtool: prod ? false : 'source-map'
}

export default config;
