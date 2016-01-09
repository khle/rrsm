var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: __dirname + "/client/app.jsx",
    output: {
        path: __dirname + "/client/dist",
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },
};
