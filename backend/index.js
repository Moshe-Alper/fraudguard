const express = require('express')
const cors = require('cors')
const path = require('path')
const recommendRouter = require('./routes/recommend')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api', recommendRouter)

const distPath = path.join(__dirname, '../frontend-react/dist')
app.use(express.static(distPath))
function serveSpa(_req, res) {
  res.sendFile(path.join(distPath, 'index.html'))
}

app.get('*', serveSpa)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
