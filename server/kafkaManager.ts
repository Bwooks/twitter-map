import kafka from 'kafka-node'
const { KafkaClient: Client, Producer, Consumer } = kafka
import dotenv from 'dotenv'

dotenv.config()
const { KAFKA_HOST, KAFKA_MAIN_TOPIC } = process.env

type kafkaManagerOptionsType = {
    topic?: string,
    partition?: number,
    offset?: number,
    kafkaHost: string
}

class KafkaManager {

    private consumer: any
    private readonly producer: any
    private readonly topic: string
    private readonly partition: number
    private readonly client: any

    constructor({ kafkaHost, topic, partition, offset }: kafkaManagerOptionsType) {
        this.topic = topic || KAFKA_MAIN_TOPIC
        this.partition = partition || 0
        const consumerOptions = {
            topic: this.topic,
            partition: this.partition,
            ...(typeof offset === 'number' ? { offset } : {})
        }
        this.client = new Client({ kafkaHost: kafkaHost || KAFKA_HOST })
        this.producer = new Producer(this.client)
        this.consumer = new Consumer(this.client, [consumerOptions], null)
    }

    publish(messages: string | Array<string>, callback): void {
        if (!messages) return

        const payload = {
            topic: this.topic,
            partition: this.partition,
            messages
        }

        if (this.producer && this.producer.ready) {
            this.producer.ready && this.producer.send([payload], (err, data) => {
                //console.log(`Published to topic ${this.topic}`)
                callback && callback(err, data)
            })

            this.producer.on('error', (error) => {
                console.log(`Error: ${error}`)
            })
        }
    }

    read(callback) {
        console.log("BEFORE READ CB")
        this.consumer.on('message', (message) => {
            callback && callback(null, message)
        })

        this.consumer.on('error', (error) => {
            callback && callback(error, null)
        })

    }
}

export default KafkaManager
