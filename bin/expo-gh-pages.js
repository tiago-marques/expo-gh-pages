#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const nrc = require('node-run-cmd');

function publish() {  
  return new Promise((resolve, reject) => {
    const package = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'UTF-8'))
    let homepage = package.homepage
    if(homepage.indexOf(homepage.length -1) === '/'){
      homepage.slice(0, -1);
    }
    var commands = [
      `expo export --public-url ${homepage}`,
      'gh-pages -d dist'
    ];

    var options = { cwd: process.cwd() };
    nrc.run(commands, options).then(async function done(codes){
      console.log(codes)
      homepage = homepage.replace('http', 'exp')
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
      resolve()
  }, function err(err){
    return reject(err);
  })
  });
}



function main(args) {
  return publish()
}

if (require.main === module) {
  main(process.argv)
    .then(() => {
      process.stdout.write('Published\n');
    })
    .catch(err => {
      process.stderr.write(`${err.message}\n`, () => process.exit(1));
    });
}

exports = module.exports = main;

