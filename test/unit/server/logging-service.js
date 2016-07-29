const test = require('tape')
const { stat, statSync, unlinkSync, readFileSync } = require('fs')
const logLocation = 'test/unit/resources/mock-logs'
const logFileName = 'mock.log'
const { getDate, generateTimestamp } = require('../../../common/common-utils')()
// Load the service we're testing
const { log } = require('../../../server/logging-service/logging-service')(logLocation, logFileName)
const fullFileLocation = logLocation + '/' + getDate() + '_' + logFileName

stat(fullFileLocation, (error, stat) => {
  if (error !== null && error.code === 'ENOENT') {
    // Log file does not exist, nothing to do
  } else {
    // Delete existing log file before tests start
    unlinkSync(fullFileLocation)
  }
})

// Fairly silly function required to ensure that the file has actually been written before the assertion is run
const checkFileExists = (location) => {
  const result = statSync(location, (error, stat) => {
    if (error !== null && error.code === 'ENOENT') {
      return false
    } else {
      return statSync(location)
    }
  })
  return result
}

test('Logging Service:', t => {

  test('should log the information requested', t => {
    const testMessage = 'this is a test message'
    const testMessage2 = 'this is a test message as well'
    log(testMessage, testMessage2)
    const result =  checkFileExists(fullFileLocation).isFile()
    t.equal(result, true)

    t.end()
  })

  t.end()
})
