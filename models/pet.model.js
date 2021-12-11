const { DataTypes, fn, where, col } = require('sequelize')
const db = require('../db')

const Pet = db.define('pet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  species: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  location: DataTypes.STRING,
  adopted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  image: DataTypes.TEXT
})

Pet.wasAdopted = async function (id) {
  this.findByPk(id).then((pet) => {
    if (pet) {
      pet.update({ adopted: true })
    }
  })
}

Pet.getBySpecies = async function (species) {
  return this.findAll({
    where: {
      species: where(fn('LOWER', col('species')), 'LIKE', `%${species}%`)
    }
  })
};

(async () => {
  await Pet.sync()
})()

module.exports = Pet
