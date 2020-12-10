require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const Twitter = require('twitter')

const client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN_KEY,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
})
let STREAMING = false

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
})

app.get('/api/tweets', (req, res) => {

	const stream = client.stream('statuses/filter', { 'locations':'-180,-90,180,90' })
	STREAMING = true
	stream.on('data', (data) => {
		if (data.coordinates) {
			const coordinates = { lat: data.coordinates.coordinates[0], lng: data.coordinates.coordinates[1] }
			if (STREAMING) {
				res.write(JSON.stringify(coordinates))
			} else {
				res.end()
			}
		}
	})

	stream.on('error', (error) => {
		console.log('err', error)
	})
})

app.post('/api/tweets/stop', (req, res) => {
	STREAMING = false
	res.sendStatus(200)
})

app.listen(port, (req, res) => {
	console.log(`LISTENING ON PORT ${port}`)
})

