const { formatChecker } = require('../helpers/index')

exports.jsonChecker = async function (req, res, next) {
  const urlPath = /\B(\/adopt\/\d+)\b/.test(req.url) ? 'adopt' : req.url
  try {
    if (!req.body.data) {
      throw new Error('No data found')
    }
    const formatMethod = {
      '/pet/add': formatChecker.addPet,
      adopt: formatChecker.adoptPet
    }[urlPath]

    if (!formatMethod) {
      throw new Error('Invalid url')
    }

    req.pet = formatMethod(req.body.data)
    next()
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    })
  }
}
