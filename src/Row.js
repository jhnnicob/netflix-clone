import React, { useEffect, useState } from 'react'
import axios from './axios'
import './Row.css'
import Youtube from 'react-youtube'
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original"

export default function Row({title, fetchUrl, isLargerRow}) {
    const [movies, setMovies] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("")
    
    useEffect(() => {
        
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results)
            return request;
        }
        fetchData();
    },[fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1
        }
    }

    const handleClick = (movie) => {
        console.log(movie)
        if(trailerUrl) {
            setTrailerUrl('');
        }else {
            movieTrailer(movie?.name || "")
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'))
                console.log(trailerUrl)
            }).catch((error) => console.log(error));
        }
    }

    return (
            <div className="row">
                <h2>{title}</h2>
                <div className="row_posters">
                    {
                    movies.map(movie => (
                        <img 
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                            className={`row_poster ${isLargerRow && "row_posterLarge"}`}
                            src={`${base_url}${movie.poster_path}`} 
                            alt={movie.name} />
                    ))
                }
            </div>
            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} /> }
        </div>
    )
}
