import { useState, useEffect } from 'react'

export const useFetch = (url:string) => {
    const [ response, setResponse ] = useState(null)
    const [ error, setError ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const response = await fetch(url)
                setResponse(response)
                setLoading(false)
            } catch(error) {
                setError(error)
                setLoading(false)
            }
        })()
    }, [url])
    return [response, loading, error]
}
