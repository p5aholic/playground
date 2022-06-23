// Sass API: https://sass-lang.com/documentation/js-api
// PostCSS API: https://postcss.org/api/

const fs = require('fs')
const path = require('path')
const makeDir = require('make-dir')
const sass = require('sass')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

const srcCssPath = path.resolve(__dirname, './src/css')
const destCssPath = path.resolve(__dirname, './public/css')

const srcFile = path.join(srcCssPath, 'style.scss')
const destFile = path.join(destCssPath, 'style.css')

const isWatch = process.argv[2] === 'watch'
const isProd = process.argv[2] === 'prod'

// css書き出し実行関数
const renderCss = async () => {
  let sassResult

  try {
    sassResult = await new Promise((resolve, reject) => {
      sass.render(
        {
          file: srcFile,
          outFile: destFile,
          outputStyle: isProd ? 'compressed' : 'expanded',
          sourceMap: true,
        },
        (error, result) => {
          if (error) {
            reject(error)
            return
          }
          resolve(result)
        }
      )
    })
  } catch (error) {
    console.error(error.formatted.toString())
    return
  }

  const postcssResult = await postcss([autoprefixer]).process(sassResult.css, {
    from: 'style.css',
    to: 'style.css',
    map: {
      prev: sassResult.map.toString(),
    },
  })

  await makeDir(destCssPath)

  fs.writeFileSync(destFile, postcssResult.css)
  fs.writeFileSync(path.join(destCssPath, 'style.css.map'), postcssResult.map.toString())

  console.log('CSS build task successfully ended')
}

if (isWatch) {
  fs.watch(srcCssPath, { recursive: true }, renderCss)
  console.log(`${srcCssPath} is being watched for changes`)
}
else {
  renderCss()
}
