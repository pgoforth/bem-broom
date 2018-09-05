const path = require('path')

module.exports = {
    bail: true,
    entry: ['./index.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bem-broom.js',
        library: 'bem-broom',
        libraryTarget: 'umd',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-proposal-object-rest-spread'
                    ]
                }
            },
        ],
    },
    plugins: [],
}
