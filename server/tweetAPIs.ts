import { Router } from 'express'
import KafkaManager from './kafkaManager.js'
const routes = Router()
const { KAFKA_HOST } = process.env
const kafkaManager = new KafkaManager({ kafkaHost: KAFKA_HOST })

routes.get('/api/tweets', (req, res) => {
    try {
        kafkaManager.read((err, message) => {
            if (err) {
                console.log(`Error reading from kafka ${err}`)
            } else {
                console.log("MESSAGE FROM KAFKA", message)
            }
        })
    } catch (readError) {
        console.log(`Error reading from kafka topic ${readError}`)
    }
})

routes.post('/api/tweets/stop', (req, res) => {
    res.sendStatus(200)
})

export default routes
