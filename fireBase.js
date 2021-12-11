const admin = require('firebase-admin')
const serviceAccount = require('./fireBaseKey.json')
const { Pet } = require('./models')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'linuxshop-3a17a.appspot.com'
})

const storage = admin.storage().bucket()
//* Get all pets and set an image url from firebase storage for each pet
;(async () => {
  const pets = await Pet.findAll()
  pets.forEach(async (pet) => {
    const species = pet.species
    const id = Math.floor(Math.random() * 10) + 1
    storage
      .file(`pets/${species}/${id}.jpg`)
      .getSignedUrl({ action: 'read', expires: '01-01-2100' })
      .then(async (url) => {
        await pet.update({ image: url[0] })
        await pet.save()
      })
  })
})()
