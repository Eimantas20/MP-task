import { useState, createContext, useEffect } from 'react';

export const PicturesContext = createContext();

export const PicturesProvider = (props) => {
    const [data, setData] = useState([]);
    const [searchInput, setSearchInput ] = useState('')
    const { REACT_APP_UNSPLASH_API_KEY } = process.env;

    useEffect(() => {
        fetchData('random')
    }, [])

    async function fetchData(searchInput){
        const response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchInput}&per_page=12`, 
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Client-ID ${REACT_APP_UNSPLASH_API_KEY}`
            }
            
        });
        if (response.ok) {
            let json = await response.json()
            setData(json.results)
        } else {
            console.log(`HTTP-error: ${response.status}`)
        }
    }

    return(
        <PicturesContext.Provider value={[data, setData, searchInput, setSearchInput, fetchData]}>
            {props.children}
        </PicturesContext.Provider>
    )
}