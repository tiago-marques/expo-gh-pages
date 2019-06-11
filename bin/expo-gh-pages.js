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
      homepage = homepage.slice(0, -1);
    }
    var commands = [
      `expo export --public-url ${homepage}`,
      'gh-pages -d dist'
    ];

    var options = { cwd: process.cwd() };
    nrc.run(commands, options).then(async function done(codes){
      console.log(codes)
      let exphomepage = homepage.replace('http', 'exp')
      const androidIndexJsonURI = `${exphomepage}/android-index.json`
      const iosIndexJsonURI = `${exphomepage}/ios-index.json`
    
      const androidQrCode = await qrcode.toDataURL(androidIndexJsonURI)
      const iosQrCode = await qrcode.toDataURL(iosIndexJsonURI)
      
      fs.writeFileSync('./dist/index.html',
`<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"
        integrity="sha256-vK3UTo/8wHbaUn+dTQD0X6dzidqc5l7gczvH+Bnowwk=" crossorigin="anonymous" />
    <meta charset="UTF-8">
    <title>expo-gh-pages</title>
</head>

<body>
    <div class="bd-example">
        <section class="hero is-medium is-dark is-bold">
            <div class="hero-body">
                <div class="container">
                    <p class="title">
                        ${homepage}
                    </p>
                    <p class="subtitle">
                        expo-gh-pages
                    </p>
                </div>
            </div>
        </section>
    </div>
    <div class="container">
    <div class="columns">
        <div class="column">
            <h1 class="title has-text-centered">
                Android
            </h1>
            <img src="${androidQrCode}" style="display: block;
            margin-left: auto;
            margin-right: auto;" />
        </div>
        <div class="column">
            <h1 class="title has-text-centered">
                iOS
            </h1>
            <img src="${iosQrCode}" style="display: block;
            margin-left: auto;
            margin-right: auto;" />
        </div>
        </div>
    </div>
</body>

</html>`);
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

