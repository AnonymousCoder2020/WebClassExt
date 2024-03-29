const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('inline-chunk-html-plugin')

const project = ['web-cls-ext'][0]
//             0        1         2           3            4       5              6           7              8
const page = ['index', 'course', 'download', 'timetable', 'skip', 'answer_form', 'syllabus', 'syllabus_ls', 'to_student_menu'][4]
const ext = ['ts', 'js'][0]
const html = 0

const optionalPlugin = html
  ? [
      new HtmlWebpackPlugin({
        inject: true,
        template: resolve(`./src//${page}.html`)
      }),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/\.(js|css)$/])
    ]
  : []

module.exports = {
  // devtool: 'source-map',
  entry: {
    [`${page}`]: `./src/${page}.${ext}`
  },
  output: {
    filename: `${page}.js`,
    path: resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.[mc]?js/,
        resolve: { fullySpecified: false }
      },
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: ['ts-loader'],
        resolve: { fullySpecified: false }
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    alias: {
      '~': resolve('src'),
      '~lib': resolve('src/lib'),
      '~comp': resolve('src/comp')
    }
  },
  plugins: [
    ...optionalPlugin
    // new (require('license-webpack-plugin').LicenseWebpackPlugin)({
    //   outputFilename: 'licenses/[name].txt' // licensesフォルダに出力
    // })
  ]
}
