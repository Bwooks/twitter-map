import { Router } from 'express'
import KafkaManager from './kafkaManager'
// TODO: Get websockets working and stream data from kafka topic to frontend
const routes = Router()

routes.get('/api/stream', () => {

})

routes.post('/api/tweets/stop', (req, res) => {
    res.sendStatus(200)
})

export default routes
