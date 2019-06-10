const fs = require('fs');
const path = require('path')
const qrcode = require('qrcode');
const nrc = require('node-run-cmd');

run().catch(error => console.error(error.stack));

async function run() {
  const package = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'UTF-8'))
  nrc.run(`expo export --public-url ${package.homepage}`);
  const homepage = package.homepage.replace('http', 'exp')
  if(homepage.indexOf(homepage.length -1) === '/'){
    homepage.slice(0, -1);
  }
  const androidIndexJsonURI = `${homepage}/android-index.json`
  const iosIndexJsonURI = `${homepage}/ios-index.json`

  const androidQrCode = await qrcode.toDataURL(androidIndexJsonURI)
  const iosQrCode = await qrcode.toDataURL(iosIndexJsonURI)
  
  fs.writeFileSync('./dist/index.html', `
  <h1>Expo GH Pages</h1>
  <h2>Android</h2>
  <img src="${androidQrCode}">
  <h2>iOS</h2>
  <img src="${iosQrCode}">
  `);
  console.log('Wrote to ./index.html');
}