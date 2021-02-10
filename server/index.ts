import express from 'express'
import dotenv from 'dotenv'
import tweetAPIs from './tweetAPIs.js'
import startStreamingTweets from './twitterStream.js'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

dotenv.config()
app.use(cors())
app.use('/', tweetAPIs)

startStreamingTweets()

app.listen(port, (req, res) => {
	console.log(`LISTENING ON PORT ${port}`)
})

