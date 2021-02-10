import { Router } from 'express'
import KafkaManager from './kafkaManager.js'
const routes = Router()
const { KAFKA_HOST } = process.env
const kafkaManager = new KafkaManager({ kafkaHost: KAFKA_HOST })

routes.get('/api/tweets/stream', (req, res) => {
    console.log("STREAM")
    kafkaManager.read((err, message) => {
        if (err) {
            console.log(`Error reading from kafka ${err}`)
        } else {
            console.log('MESSAGE', message)
            res.write(message.value)
        }
    })
})

routes.post('/api/tweets/stop', (req, res) => {
    res.sendStatus(200)
})

export default routes
