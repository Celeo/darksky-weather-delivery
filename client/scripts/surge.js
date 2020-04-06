const fs = require('fs')
const path = require('path')

const CNAME = 'CNAME'
const sourceCNAME = path.join(__dirname, '..', CNAME)
const destinationCNAME = path.join(__dirname, '..', 'build', CNAME)

if (fs.existsSync(sourceCNAME)) {
  fs.copyFileSync(sourceCNAME, destinationCNAME)
  console.log(`Copied ${CNAME} file to ./build/`)
} else {
  console.log(`Did not copy CNAME file - does not exist in ${__dirname}`)
}
