const express = require('express')
const app = express()
const port = 3000

const conversation = require('./controllers/conversation')
const user = require('./controllers/user')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user',user)
app.use('/conversation',conversation)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})