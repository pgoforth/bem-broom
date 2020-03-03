module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2017,
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
        },
        sourceType: 'module',
    },
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    plugins: ['import', 'jest', 'babel', 'standard', 'json'],
    extends: ['eslint:recommended'],
};
