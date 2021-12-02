const { DataTypes } = require('sequelize')
const db = require('../db')
const availablePet = db.define('available_pet', {
  id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  species: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false }
})

availablePet.adopted = async function (id) {
  this.findByPk(id).then((pet) => {
    if (pet) {
      pet.destroy()
    }
  })
}

availablePet.checkIfExists = async function (id) {
  const pet = await this.findByPk(id)

  if (!pet) {
    throw new Error('Pet not found')
  }

  return pet
};

(async () => {
  await availablePet.sync()
})()

module.exports = availablePet
