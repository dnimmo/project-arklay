const { generateTimestamp, getDate } = require('../../common/common-utils')()
const { stat, mkdir, appendFile } = require('fs')

const logService = (logLocation, logFileName) => {
  // Create the requested log directory if it doesn't exist already
  stat(logLocation, (error, stat) => {
    if (error !== null && error.code === 'ENOENT') {
      mkdir(logLocation)
    }
  })

  const log = (...messages) => {
    const fullFileLocation = `${logLocation}/${getDate()}_${logFileName}`
    const messagesToLog = messages.map(message => `\n${message}\n`)
    appendFile(fullFileLocation, `${generateTimestamp()}${messagesToLog}`)
  }

  return {
    log: log
  }
}

module.exports = logService
