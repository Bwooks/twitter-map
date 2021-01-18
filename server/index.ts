import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import tweetAPIs from './tweetAPIs.js'
import startStreamingTweets from './twitterStream.js'

const app = express()
const port = process.env.PORT || 3000
const __dirname = import.meta.url

dotenv.config()
console.log("WOOO")
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))
app.use('/', tweetAPIs)

startStreamingTweets()

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
})

app.listen(port, (req, res) => {
	console.log(`LISTENING ON PORT ${port}`)
})

