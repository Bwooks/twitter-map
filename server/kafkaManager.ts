import kafka from 'kafka-node'
const { KafkaClient: Client, Producer, Consumer } = kafka
import dotenv from 'dotenv'

dotenv.config()
const { KAFKA_HOST, KAFKA_PRODUCER_TOPIC, KAFKA_CONSUMER_TOPIC } = process.env

class KafkaManager {

    private consumer: any
    private producer: any
    private readonly client: any

    constructor(kafkaHost) {
        this.client = new Client({ kafkaHost: kafkaHost || KAFKA_HOST })
        this.producer = null
        this.consumer = null
    }

    publish({ topic, messages, partition }, callback) {
        if (!messages) return

        const payload = {
            topic: topic || KAFKA_PRODUCER_TOPIC,
            partition: partition || 0,
            messages
        }

        if (!this.producer) {
            this.producer = new Producer(this.client)
        } else {
            this.producer.ready && this.producer.send([payload], (err, data) => {
                console.log(`Published to topic ${topic}`)
                callback && callback(err, data)
            })

            this.producer.on('error', (error) => {
                console.log(`Error: ${error}`)
            })
        }
    }

    read({ topic, partition }: { topic: string | undefined, partition: number | undefined}, callback) {

        const options = {
            topic: topic || KAFKA_CONSUMER_TOPIC,
            partition: partition || 0
        }

        if (!this.consumer) {
            this.consumer = new Consumer(this.client, [options], null)
        } else {
            this.consumer.on('message', (message) => {
                callback && callback(message, null)
            })

            this.consumer.on('error', (error) => {
                callback && callback(null, error)
            })
        }
    }
}

export default KafkaManager
