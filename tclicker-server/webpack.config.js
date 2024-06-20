const path = require('path');

module.exports = (env) => {
    return {
        mode: 'production',
        entry: {
            main: path.resolve(__dirname, 'index.js')
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            clean: true
        },
        target: 'node',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }
            ]
        }
    }
};