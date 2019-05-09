import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import {
  uglify
} from 'rollup-plugin-uglify'

const banner = '/* @license saber2pr @see https://github.com/Saber2pr/saber-ioc */'

const compress = uglify({
  output: {
    comments: function (node, comment) {
      if (comment.type === "comment2") {
        // multiline comment
        return /@preserve|@license|@cc_on/i.test(comment.value);
      }
      return false;
    }
  }
})

export default {
  input: './lib/index.js',
  output: {
    file: './saber-ioc.min.js',
    format: 'umd',
    name: 'sioc',
    banner
  },
  watch: {
    include: 'lib/**'
  },
  plugins: [resolve(), commonjs(), compress]
}