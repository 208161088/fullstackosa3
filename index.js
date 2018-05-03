const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
morgan.token('data', function (req, res) { 
  return JSON.stringify(req.body) })
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  }
  if (body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  Person
    .find({name: person.name})
    .then(result => {
      if (result.length===0){
        person
        .save()
        .then(savedPerson => {
          response.json(Person.format(savedPerson))
        })
      }else{
        response.status(406).json({error: 'name must be unique'})
      }
    })
})

app.get('/api/persons', (request, response) => {
  Person
  .find({})
  .then(persons => {
    
    response.json(persons.map(Person.format))
  })
})

app.get('/info', (request, response) => {
  Person
  .find({})
  .then(persons => {
    response.send('puhelinluettelossa on '+persons.length+' henkilön tiedot<br>'+new Date())
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person){
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
      
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })


})

app.delete('/api/persons/:id', (request, response) => {
  Person
  .findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => {
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }
  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})