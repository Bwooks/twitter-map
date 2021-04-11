import kafka from 'kafka-node'
const { KafkaClient: Client, Producer, Consumer } = kafka
import dotenv from 'dotenv'

dotenv.config()
const { KAFKA_HOST, KAFKA_MAIN_TOPIC } = process.env

type kafkaManagerOptionsType = {
    topic?: string,
    partition?: number,
    kafkaHost: string
}

class KafkaManager {

    private consumer: any
    private readonly producer: any
    private readonly topic: string
    private readonly partition: number
    private readonly client: any

    constructor({ kafkaHost, topic, partition }: kafkaManagerOptionsType) {
        this.topic = topic || KAFKA_MAIN_TOPIC
        this.partition = partition || 0
        this.client = new Client({ kafkaHost: kafkaHost || KAFKA_HOST })
        this.producer = this.createProducer(this.client)
        this.consumer = this.createConsumer({topic: this.topic, partition: this.partition})
    }

    private createProducer(client) {
        const producer = new Producer(client)

        producer.on('error', (error) => {
            console.log(`Error creating producer ${error}`)
        })

        return producer
    }

    private createConsumer({topic, partition}) {
        const consumer = new Consumer(this.client, [{ topic, partition }], null)

        consumer.on('error', (error) => {
            console.log(`Error reading from topic ${topic}: ${error}`)
        })

        return consumer
    }

    public publish(messages: string | Array<string>, callback?): void {
        if (!messages) return

        const payload = {
            topic: this.topic,
            partition: this.partition,
            messages
        }

        if (this.producer && this.producer.ready) {
            this.producer.ready && this.producer.send([payload], (err, data) => {
                console.log(`Published to topic ${this.topic}`, data)
                callback && callback(err, data)
            })

            this.producer.on('error', (error) => {
                console.log(`Error: ${error}`)
            })
        }
    }

    public read(callback) {
        this.consumer.on('message', (message) => {
            callback && callback(null, message)
        })
    }

    public pause(topic, callback) {
        console.log("PAUSING")
        this.consumer.pauseTopics(topic || KAFKA_MAIN_TOPIC)
        callback()
    }

    public resume(topic, callback) {
        console.log("RESUME")
        this.consumer.resumeTopics(topic || KAFKA_MAIN_TOPIC)
        callback()
    }
}

export default KafkaManager
