import { kafkaClient as Client, Producer, Consumer } from 'kafka-node'
import dotenv from 'dotenv'

dotenv.config()

class KafkaManager {
    constructor(kafkaHost) {
        this.client = new Client({ kafkaHost: kafkaHost || process.env.KAFKA_HOST })
        this.producer = new Producer(this.client)
        this.consumer = new Consumer(this.client, [{ topic: process.env.KAFKA_CONSUMER_TOPIC }])
    }

    publish({ topic, messages }, callback) {
        const { producer } = this

        const payload = {
            topic,
            messages
        }

        producer.on('ready', () => {
            producer.send(payload, (err, data) => {
                console.log(`Published to topic ${topic}`)
                callback && callback(err, data)
            })
        })
    }

    read({ topic, partition }, callback) {
        this.consumer.addTopics([{ topic, partition }])

        this.consumer.on('message', async(message) => {
            callback && callback(message, null)
        })

        this.consumer.on('error', (error) => {
            callback && callback(null, error)
        })
    }

    createTopic({ topic, partitions = 1 }, callback) {
        const topicToCreate = {
            topic,
            partitions
        }

        this.client.createTopics([topicToCreate], (error, result) => {
            console.log(`Topic ${topic} created successfully`, result)
            callback && callback(error, result)
        })
    }
}

export default KafkaManager
