import fs from 'fs'
import path from 'path'
import generateHtml from './generateHtml.js'
import qrcode from 'qrcode'

export default async function createPage () {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'UTF-8'))
  let { homepage, name } = packageJson
  if (homepage.charAt(homepage.length - 1) === '/') {
    homepage = homepage.slice(0, -1)
  }
  let exphomepage = homepage.replace('http', 'exp')
  const androidIndexJsonURI = `${exphomepage}/android-index.json`
  const iosIndexJsonURI = `${exphomepage}/ios-index.json`

  const androidQrCode = await qrcode.toDataURL(androidIndexJsonURI)
  const iosQrCode = await qrcode.toDataURL(iosIndexJsonURI)
  fs.writeFileSync('./dist/index.html', generateHtml({
    homepage,
    androidIndexJsonURI,
    iosIndexJsonURI,
    androidQrCode,
    iosQrCode,
    name
  }))
}