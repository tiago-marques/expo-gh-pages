#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const nrc = require('node-run-cmd');
const generateHtml = require('../lib/generateHtml')

function clean(){
  var commands = [
    'rm -rf dist'
  ];

  var options = { cwd: process.cwd() };
  return nrc.run(commands, options);
}

function expoExport(){
  const package = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'UTF-8'));
  let homepage = package.homepage;
  if(homepage.charAt(homepage.length -1) === '/'){
    homepage = homepage.slice(0, -1);
  }
  var commands = [
    `expo export --public-url ${homepage}`,
  ];

  var options = { cwd: process.cwd() };
  return nrc.run(commands, options);
}

async function createPage(){
    const package = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'UTF-8'));
    let homepage = package.homepage;
    if(homepage.charAt(homepage.length -1) === '/'){
      homepage = homepage.slice(0, -1);
    }
    let exphomepage = homepage.replace('http', 'exp');
    const androidIndexJsonURI = `${exphomepage}/android-index.json`;
    const iosIndexJsonURI = `${exphomepage}/ios-index.json`;
  
    const androidQrCode = await qrcode.toDataURL(androidIndexJsonURI);
    const iosQrCode = await qrcode.toDataURL(iosIndexJsonURI);
    
    fs.writeFileSync('./dist/index.html', generateHtml({
      homepage, 
      androidIndexJsonURI, 
      iosIndexJsonURI, 
      androidQrCode, 
      iosQrCode
    }));
}

function createFavIco(){
  return Promise((resolve, reject) => {
      fs.copyFile('./favicon.ico', './dist/favicon.ico', err => {
        err && reject()
        resolve()
      })
  })
}

function publish() {  
  var commands = [
    'gh-pages -d dist'
  ];

  var options = { cwd: process.cwd() };
  return nrc.run(commands, options);
}

function main(args) {
  return clean()
  .then(expoExport)
  .then(createPage)
  .then(createFavIco)
  .then(publish)
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