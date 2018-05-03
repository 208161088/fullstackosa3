const mongoose = require('mongoose')
const url = 'mongodb://<dbuser>:<dbpassword>@ds261969.mlab.com:61969/fullstackdb'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const arg = process.argv
if (arg.length>2){
    const person = new Person({
        name: arg[2],
        number: arg[3]
      })

    person
    .save()
    .then(response => {
        console.log('lisätään henkilö '+arg[2]+' numero '+arg[3]+' luetteloon')
        mongoose.connection.close()
    })
}else{
    Person
    .find({})
    .then(result => {
        console.log('puhelinluettelo:')
        result.forEach(person => {
            console.log(person.name+' '+person.number)
        })
        mongoose.connection.close()
    })
}





