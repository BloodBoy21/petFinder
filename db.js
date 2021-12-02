const { Sequelize } = require('sequelize')
const {
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT
} = require('./config/index')
const db = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  dialect: 'postgres',
  logging: false
})

db.authenticate()
  .catch((err) => {
    console.warn('Error connecting to database: ', err)
  })

module.exports = db
