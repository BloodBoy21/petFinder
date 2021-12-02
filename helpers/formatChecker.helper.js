const propertiesInJSON = [
  'photo',
  'name',
  'species',
  'age',
  'location',
  'gender',
  'owner',
  'email'
]
const typesForEachProperty = {
  name: 'string',
  species: 'string',
  age: 'number',
  location: 'string',
  gender: 'string',
  owner: 'string',
  email: 'string',
  photo: 'string'
}

function jsonHasOwnProperty (json, keys) {
  let result = true
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(json, key) === false) {
      result = false
    }
  })
  return result
}

function filterJSON (json, filters) {
  const result = {}
  Object.keys(json).forEach((key) => {
    if (filters.includes(key)) {
      result[key] = json[key]
    }
  })
  return result
}

function jsonCorrectPropertyType (json) {
  let result = true
  Object.keys(json).forEach((key) => {
    if (typesForEachProperty[key] !== typeof json[key]) {
      result = false
    }
  })
  return result
}

function addPet (pet) {
  const allowedProperties = propertiesInJSON.slice(0, 6)
  const requiredProperties = allowedProperties.slice(1, 6)

  if (!jsonHasOwnProperty(pet, requiredProperties)) {
    throw new Error('Invalid format')
  }

  pet = filterJSON(pet, allowedProperties)

  if (!jsonCorrectPropertyType(pet)) {
    throw new Error('Invalid  data type sent')
  }

  return pet // returns the pet object with the correct format
}

// TODO adopt format method
function adoptPet (owner) {
  const allowedProperties = propertiesInJSON.slice(6, 8)
  const requiredProperties = allowedProperties

  if (!jsonHasOwnProperty(owner, requiredProperties)) {
    throw new Error('Invalid format')
  }

  owner = filterJSON(owner, allowedProperties)

  if (!jsonCorrectPropertyType(owner)) {
    throw new Error('Invalid  data type sent')
  }

  return owner // returns the owner object with the correct format
}

module.exports = {
  addPet,
  adoptPet
}
