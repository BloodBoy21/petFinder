const http = require('http')
const request = require('request')
const baseUrl = 'http://localhost:3000/api'
const server = require('../index')
describe('API', () => {
  afterAll(() => {
    server.close()
  })
  describe('GET /api/pet/all', () => {
    it('should return a list of pets', (done) => {
      http
        .get(`${baseUrl}/pet/all`, (res) => {
          res.on('data', (data) => {
            data = JSON.stringify(data.toString())
            const pets = JSON.parse(data)
            expect(pets.length).toBeGreaterThan(0)
            done()
          })
        })
        .on('error', (err) => {
          console.log('Error: ' + err.message)
        })
    })
  })
  describe('GET /api/adopt/:id', () => {
    it('should return a pet', (done) => {
      http.get(`${baseUrl}/adopt/5`, (res) => {
        res
          .on('data', (data) => {
            data = data.toString()
            const pet = JSON.parse(data)
            expect(pet.id).toBe(5)
            done()
          })
          .on('error', (err) => {
            console.log('Error: ' + err.message)
            done(err)
          })
      })
    })
  })
  describe('POST /api/pet/add', () => {
    it('should add a pet', (done) => {
      const pet = {
        name: 'Luna',
        species: 'Cat',
        gender: 'Female',
        age: 1,
        location: 'New York'
      }
      const options = {
        url: `${baseUrl}/pet/add`,
        json: true,
        body: { data: pet }
      }
      request.post(options, (err, res, body) => {
        if (err) {
          return console.log(err)
        }

        expect(res.statusCode).toBe(200)
        expect(body.data.name).toBe(pet.name)
        done()
      })
    })
  })
  describe('Get /api/adopt/pets?species=', () => {
    it('should return a list of available pets by species', (done) => {
      http
        .get(`${baseUrl}/adopt/pets?species=Cat`, (res) => {
          res.on('data', (data) => {
            const pets = JSON.parse(data)
            expect(pets).toBeInstanceOf(Array)
            done()
          })
        })
        .on('error', (err) => {
          console.log('Error: ' + err.message)
        })
    })
  })
  describe('Post /api/adopt/:id', () => {
    it('should adopt a pet', (done) => {
      const pet = {
        name: 'Luna',
        species: 'Cat',
        age: 1,
        location: 'New York',
        gender: 'Female'
      }
      const Owner = {
        owner: 'Alan',
        email: 'death1027@outlook.com'
      }
      const options = {
        url: `${baseUrl}/pet/add`,
        json: true,
        body: { data: pet }
      }
      request.post(options, (err, res, body) => {
        if (err) {
          return console.log(err)
        }

        const petData = body.data
        options.url = `${baseUrl}/adopt/${petData.id}`
        options.body = { data: Owner }
        request.post(options, (err, res) => {
          if (err) {
            return console.log(err)
          }

          expect(res.statusCode).toBe(200)
          done()
        })
      })
    })
  })
})
