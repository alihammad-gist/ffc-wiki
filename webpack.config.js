var path = require('path');
var ExtractText = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'dist/out'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractText.extract('style-loader', 'css-loader', 'sass-loader')
            }
        ]
    },
    resolveLoader: {
        root: '/usr/lib/node_modules'
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, './sass')]
    },
    plugins: [
        new ExtractText('styles.css')
    ],
    resolvePlugin: {
        root: "/usr/lib/node_modules"
    }
}