const path = require('path');
const postcss = require('rollup-plugin-postcss')
const babel = require('rollup-plugin-babel');

const resolveFile = function(filePath) {
  return path.join(__dirname, '..', filePath)
}

const isProductionEnv = process.env.NODE_ENV === 'production'

module.exports = [
  {
    input: resolveFile('src/main.js'),  // 入口文件
    output: [{
      file: resolveFile('dist/index.js'), // 输出 JS 文件
      format: 'umd',
      name: 'ErCanvas'
    },{
      file: resolveFile('dist/index.min.js'), // 输出 JS 压缩文件
      format: 'umd',
      name: 'ErCanvas'
    },{
      file: resolveFile('dist/index.es.js'), // 输出 JS es 文件
      format: 'es'
    }],
    plugins: [                          // 插件
      postcss({
        extract: resolveFile('dist/index.css'),
        minimize: isProductionEnv,
      }),
      babel() // 编译 es6+, 配合 .babelrc 文件
    ],
  },
]
