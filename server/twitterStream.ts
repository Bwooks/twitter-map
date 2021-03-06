import twitter from 'twitter'
import KafkaManager from './kafkaManager.js'

const { CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET, KAFKA_HOST } = process.env

const kafkaManager = new KafkaManager({ kafkaHost: KAFKA_HOST })
console.log("KAFKA HOST", KAFKA_HOST)
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
        if (data.coordinates) {
            const formattedData = {
                ...data,
                coordinates: {
                    ...data.coordinates,
                    lat: data.coordinates.coordinates[0],
                    lng: data.coordinates.coordinates[1]
                }
            }
            kafkaManager.publish(JSON.stringify(formattedData))
        }
    })

    stream.on('error', (error) => {
        console.log('err', error)
    })
}

export default startStreamingTweets
