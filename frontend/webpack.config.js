const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        hot: true,
        port: 3000,
    },
    target: ['web', 'es2017'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-react',
                                ['@babel/preset-env', {
                                    targets: '> 0.25%, not dead',
                                    useBuiltIns: 'usage',
                                    corejs: 3,
                                }],
                            ],
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                noEmit: false,
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
    ],
};
