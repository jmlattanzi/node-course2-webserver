const express = require('express')
const hbs = require('hbs')
const fs = require('fs')

var app = express()

// tell express what engine to use and what middleware to use
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

app.use((req, res, next) => {
  var now = new Date().toString()
  var log = `${now}: ${req.method} ${req.url} ${req.ip}`
  console.log(log)

  fs.appendFile('server.log', log + '\n', (err) => {
    if (err)
      console.log('*** unable to append log file ***')
  })
  next()
})

// future note: enable by admin
// eg: if (maintenanceMode) { enable maintenance lock }
// app.use((req, res, next) => {
//   res.render('maintenance.hbs')
// })

// setup public middleware after the maintenance or else you can access public
app.use(express.static(__dirname + '/public'))

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'go away',
    welcomeMessage: 'ahoy',
  })
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'about',
    welcomeMessage: 'ahoy',
  })
})

// challende: create /bad route, send back json w error message property
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'unable to find whatever'
  })
})

app.listen(3000, () => {
  console.log('server is up on port 3000')
})
