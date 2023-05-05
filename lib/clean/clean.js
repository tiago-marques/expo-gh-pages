import nrc  from 'node-run-cmd'

export default function clean () {
  var commands = [
    'rm -rf dist',
    'gh-pages-clean'
  ]

  var options = { cwd: process.cwd() }
  return nrc.run(commands, options)
}


