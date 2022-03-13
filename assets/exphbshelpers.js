var register = function (Handlebars) {
  var helpers = {
    // put all of your helpers inside this object
    ifEquals: function (arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
    },
    ifNotEquals: function (arg1, arg2, options) {
      return (arg1 !== arg2) ? options.fn(this) : options.inverse(this)
    },
    addLeadingZero: function (dtg) {
      const str = dtg.toString()
      return (str.length === 5) ? '0' + str : str
    },
    timeDiff: function (currentDtg, dtg) {
      var hours = ~~(currentDtg / 100) - ~~(dtg / 100)
      var mins = currentDtg % 100 - dtg % 100
      console.log(hours, ' ', mins)
      while (mins < 0) {
        mins += 60
        hours -= 1
      }
      return hours + 'h ' + mins + 'm'
    }
  }

  if (Handlebars && typeof Handlebars.registerHelper === 'function') {
    // register helpers
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop])
    }
  } else {
    // just return helpers object if we can't register helpers here
    return helpers
  }
}

module.exports.register = register
module.exports.helpers = register(null)
