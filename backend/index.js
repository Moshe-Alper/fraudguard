const express = require('express')
const cors = require('cors')
const path = require('path')
const recommendRouter = require('./routes/recommend')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api', recommendRouter)

const distPath = path.join(__dirname, 'public')
app.use(express.static(distPath))
function serveSpa(_req, res) {
  res.sendFile(path.join(distPath, 'index.html'))
}

app.get('*', (req, res, next) => {
  const fs = require('fs')
  if (fs.existsSync(path.join(distPath, 'index.html'))) serveSpa(req, res)
  else next()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
