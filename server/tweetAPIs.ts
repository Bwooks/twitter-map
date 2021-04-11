import { Router } from 'express'
import KafkaManager from './kafkaManager.js'
const routes = Router()
const { KAFKA_HOST, KAFKA_MAIN_TOPIC } = process.env
const kafkaManager = new KafkaManager({ kafkaHost: KAFKA_HOST })

routes.get('/api/tweets/stream', (req, res) => {
    kafkaManager.read((err, message) => {
        if (err) {
            console.log(`Error reading from kafka ${err}`)
        } else {
            res.write(message.value)
        }
    })
})

routes.post('/api/tweets/pause', (req, res) => {
    console.log("PAUSE")
    kafkaManager.pause(KAFKA_MAIN_TOPIC, () => {
        res.sendStatus(200)
    })
})

routes.post('/api/tweets/resume', (req, res) => {
    kafkaManager.resume(KAFKA_MAIN_TOPIC, () => {
        res.sendStatus(200)
    })
})

export default routes
