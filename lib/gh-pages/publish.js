import ghpages  from 'gh-pages'

export default function publish () {
  return new Promise((resolve, reject) => {
    ghpages.publish('dist', function (err) {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

