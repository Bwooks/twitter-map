export const stopStream = async() => {
    try{
        await fetch('/api/tweets/stop',{
            method :'POST',
        })
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

export const startStream = async(callback: Function) => {
    try{
        const response = await fetch('http://localhost:3000/api/tweets/stream', {
            method :'GET'
        })
        const stream = response.body

        return readFromStream(stream, callback)
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

const readFromStream = async(stream: ReadableStream, callback: Function): Promise<string> => {
    if (!stream) return null

    const streamReader = stream.getReader()
    const decoder = new TextDecoder()
    let chunk
    while(!chunk?.done) {
        chunk = await streamReader.read()
        const decodedValue = decoder.decode(chunk.value)
        try {
            callback(decodedValue)
        } catch(error) {
            console.error(`Error: ${error}`)
        }
    }
}
