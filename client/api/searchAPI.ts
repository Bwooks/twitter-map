import axios from 'axios'

const { ES_SEARCH_API } = process.env
export const queryText = async(text: string) => {
    if (!text) {
        throw new Error('Invalid text query')
    }
    return await axios.post(`${ES_SEARCH_API}`, {
        query: {
            match: {
                text
            }
        }
    })
}
