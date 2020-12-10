export const stopStream = async() => {
    try{
        await fetch('/api/tweets/stop',{
            method :'POST',
        })
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

export const startStream = async(url: string) => {
    try{
        return await fetch(url, {
            method :'GET'
        })
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

export const readFromStream = async(stream: ReadableStream, callback: Function): Promise<string> => {
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
