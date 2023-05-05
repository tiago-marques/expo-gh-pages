import path from 'path'
import fs from 'fs'

export default function createFavicon () {
  return new Promise((resolve, reject) => {
    fs.copyFile(path.resolve(__dirname, 'favicon.ico'), './dist/favicon.ico', err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}