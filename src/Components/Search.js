import { useState, useContext, useEffect, useRef } from 'react';
import { PicturesContext } from './PicturesContext';
import './search.scss';

const Search = () => {
    const inputRef = useRef(null);
    
    //If array in PicturesContext would be larger could save to separate var and take needed item using arr[arr.length - n].
    // Or as like in this case it's last item in the array, could use Arr.pop(), but would have to save to separate var as well.
    // As not passing many element can do just:
    const [, , , , fetchData] = useContext(PicturesContext);
    const [query, setQuery ] = useState('');
    const [ suggestions, setSuggestions ] = useState([]);
    const [ suggestionsModified, setSuggestionsModified ] = useState([]);
    const [ expansion, modifyExpansion ] = useState(false);
    const [ options, setOptions ] = useState([]);
    const chars = {
        'ą': 'a',
        'č': 'c',
        'ę': 'e',
        'ė': 'e',
        'į': 'i',
        'š': 's',
        'ų': 'u',
        'ū': 'u',
        'ž': 'z'
    }

    useEffect(() => {
        const searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];
        setSuggestions(searchHistory);
        setOptions(searchHistory);
        modifyHistoryForFilter(searchHistory);
        document.addEventListener('click', toggleDropdown);

        return () => document.removeEventListener('click', toggleDropdown);
    }, [])

    const toggleDropdown = (e) => {
        modifyExpansion(e.target === inputRef.current)
    }

    const handleChange = (e) => {
        e.preventDefault();
        setQuery(e.target.value);
        filter(e.target.value)
    }

    const modifyHistoryForFilter = (searchHistory) => {
        const modifiedHistory = searchHistory.map(history => {
            return history.toLowerCase().replace(/[ąčęėįšųūž]/g, m => chars[m]).split(" ");
        })
        setSuggestionsModified(modifiedHistory);
    }

    const handleClick = (e) => {
        e.preventDefault();

        if (!query) return;

        const searchHistory = JSON.parse(localStorage.getItem('search-history')) || [];

        searchHistory.length < 5 
        ? !searchHistory.includes(query) && searchHistory.push(query)
        : !searchHistory.includes(query) && searchHistory.push(query) && searchHistory.shift();

        localStorage.setItem('search-history', JSON.stringify(searchHistory));
        setSuggestions(searchHistory)
        modifyHistoryForFilter(searchHistory)
        fetchData(query)
    }

    function filter(inputQuery) {
        let queryArray = inputQuery.toLowerCase().replace(/[ąčęėįšųūž]/g, m => chars[m]).split(" ").filter(e => e);
        
        //Do check if query is longer then any suggestions
        //Check will stop filter if queryArray.length is larger then any inner array item in suggestionsModified array.
        let checkIfNotPossible = false;
        suggestionsModified.forEach(singleSuggestion => { 
            queryArray.length > singleSuggestion.length ? checkIfNotPossible = true : checkIfNotPossible = false
        });
        
        if (checkIfNotPossible) {
            inputRef.current.nextElementSibling.nextElementSibling.setAttribute('aria-expanded', false)

            return []
        } else {
            inputRef.current.nextElementSibling.nextElementSibling.setAttribute('aria-expanded', true)
        }
        
        const alterSuggestions = suggestions;
        const foo = {};
        let matchingSuggestionsIndexes = [];
        let matchedSuggestions = [];
        queryArray.forEach(string => {
            suggestionsModified.forEach((item, i) => {
                const check = (itemEuery) => {
                    let number = itemEuery.indexOf(string);
                    return number >= 0;
                }
                if(item.some(check) === true){
                    let countSuggestion = (foo[i]) ?? 0;  
                    foo[i] = countSuggestion + 1;
                }
            })
            matchingSuggestionsIndexes = Object.keys(foo).filter(k => foo[k] === queryArray.length)
        })

        matchingSuggestionsIndexes.map(requestedSuggestionId => {
            matchedSuggestions.push(alterSuggestions.filter((option, i) => i === parseInt(requestedSuggestionId)))
        })

        if (matchedSuggestions.length > 0) {
            inputRef.current.nextElementSibling.nextElementSibling.setAttribute('aria-expanded', true)
        } else if (matchedSuggestions.length === 0 && inputQuery.length > 0) {
            inputRef.current.nextElementSibling.nextElementSibling.setAttribute('aria-expanded', false)
        }

        return inputQuery.length === 0 ? setOptions(suggestions) : setOptions(matchedSuggestions.flat())
    }

    return(
        <div className="input-container">
            <h1>Use the app to find desired pictures</h1>
            <form onSubmit={handleClick}>
                <input type="text" 
                    name='search-input' 
                    onChange={handleChange} 
                    ref={inputRef} 
                    value={query}
                    placeholder='Search photos...' 
                    autoComplete='off' 
                    title="Type to search" 
                    />
                <button type="button" onClick={handleClick}></button>
                <div className='dropdown testClassName' aria-expanded={expansion}>
                        {options.map((suggestion, i) => (
                            <div key={i} onClick={() => setQuery(suggestion)} className='dropdown-item'>
                                <p>{suggestion}</p>
                            </div>
                        ))}
                </div>
            </form>
        </div>
    )
}

export default Search