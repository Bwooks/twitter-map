import twitter from 'twitter'
import kafkaManager from './kafkaManager.js'

const client = new twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
})

const COORDINATES_FOR_GLOBE = { 'locations':'-180,-90,180,90' }

const startStreamingTweets = () => {
    const stream = client.stream('statuses/filter', COORDINATES_FOR_GLOBE)

    stream.on('data', (data) => {
        kafkaManager.publish({ messages: JSON.stringify(data) })
    })

    stream.on('error', (error) => {
        console.log('err', error)
    })
}

export default startStreamingTweets
