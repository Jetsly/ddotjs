import typescript from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify';
import { version, name, author, license } from './package.json'
let config = extConfig => Object.assign({}, {
    banner: `/*!
    * ${name} v${version}
    * (c) 2017-${new Date().getFullYear()} ${author}
    * Released under the ${license} License.
*/`,
    input: 'src/index.ts'
}, extConfig)


export default [config({
    output: {
        file: 'dist/index.common.js',
        format: 'cjs'
    },
    plugins: [
        typescript({
            typescript: require('typescript')
        })
    ]
}),config({
    output: {
        file: 'dist/index.js',
        name: 'ddot',
        format: 'umd'
    },
    plugins: [
        typescript({
            typescript: require('typescript')
        })
    ]
}), config({
    output: {
        file: 'dist/index.min.js',
        name: 'ddot',
        format: 'umd'
    },
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        uglify({
            output: {
                comments: /License/i
            }
        })
    ]
})]