#!/usr/bin/env node
import chalk from 'chalk'
import { fileURLToPath } from 'url';
import process from 'process';
import ProgressBar from 'progress'

import clean from '../lib/clean/clean.js'
import expoExport from '../lib/expo/export.js'
import createPage from '../lib/website/createPage.js'
import createFavicon from '../lib/website/createFavicon.js'
import createCNAME from '../lib/website/createCNAME.js'
import publish from '../lib/gh-pages/publish.js'

let bar
const fns = [
  generateFunctionInformations(clean, bar),
  generateFunctionInformations(expoExport, bar),
  generateFunctionInformations(createPage, bar),
  generateFunctionInformations(createFavicon, bar),
  generateFunctionInformations(createCNAME, bar),
  generateFunctionInformations(publish, bar)
]
bar = new ProgressBar(':percent', { total: fns.length })

function generateFunctionInformations (functionArg) {
  return () => functionArg()
    .then(() => bar.tick())
}

function main (args) {
  return fns.reduce((promiseChain, currentTask) => {
    return promiseChain.then(chainResults =>
      currentTask().then(currentResult =>
        [ ...chainResults, currentResult ]
      )
    )
  }, Promise.resolve([])).then(arrayOfResults => {
    console.log(chalk.green('\nFinished!\n'))
  })
}
// if (require.main === module) {
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv)
    .catch(err => {
      console.log(chalk.red(`${err.message}\n`))
      process.exit(1)
    })
}

export default main
