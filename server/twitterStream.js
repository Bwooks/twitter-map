import twitter from 'twitter'
import kafkaManager from './kafkaManager.js'

const { CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET } = process.env

const client = new twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token_key: ACCESS_TOKEN_KEY,
    access_token_secret: ACCESS_TOKEN_SECRET
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
