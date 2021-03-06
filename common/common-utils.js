const commonUtils = () => {
  const prefix = value => value < 10 ? '0' : ''

  const generateTimestamp = () => {
    const date = new Date()

    var hour = date.getHours()
    hour = (prefix(hour)) + hour
    var minutes = date.getMinutes()
    minutes = (prefix(minutes)) + minutes
    var seconds = date.getSeconds()
    seconds = (prefix(seconds)) + seconds
    var day = date.getDate()
    day = (prefix(day)) + day
    var month = date.getMonth() + 1
    month = (prefix(month)) + month
    var year = date.getFullYear()

    return `${hour}:${minutes}:${seconds} ${day}/${month}/${year}`
  }

  const getDate = () => {
    const date = new Date()

    var day = date.getDate()
    day = (prefix(day)) + day
    var month = date.getMonth() + 1
    month = (prefix(month)) + month
    var year = date.getFullYear()

    return `${year}_${month}_${day}`
  }

  const valuesMatch = (a, b) => a.toString() === b.toString()

  return {
    generateTimestamp,
    getDate,
    valuesMatch
  }
}

module.exports = commonUtils
