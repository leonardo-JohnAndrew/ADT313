import { useEffect, useReducer, useState } from "react";
import { useUserContext } from "../../../../context/UserContext";
import { useParams } from "react-router-dom";
import { useCallback } from "react";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import { useMovieContext } from "../../../../context/MovieContext";
import './Photos.css'
const initial = {
    items :[],
    loading: false ,
    error: null
};

const actions = {
    FETCH_REQUEST : "FETCH_REQUEST",
    FETCH_SUCCESS: "FETCH_SUCCESS",
    FETCH_ERROR: "FETCH_ERROR",
    CREATE:"CREATE",
    UPDATE:"UPDATE",
    DELETE:"DELETE"

}

const reducer = (state , action) =>{
    switch(action.type){
        case action.FETCH_REQUEST :
            return{
                ...state,
                  loading: true, 
                  error: null 
            
            }
            case actions.FETCH_SUCCESS:
            return { 
                ...state,
                 loading: 
                 false,
                items: action.payload
      
                };
        case actions.FETCH_ERROR:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };
        case actions.CREATE:
            return { 
                ...state, 
                 loading:false,
                items: [...state.items, action.payload] 
            };
        case actions.UPDATE:
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };
        case actions.DELETE:
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            }
                default:
                    return state;
    }
}




const Photos = () =>{
         
    const [state, dispatch] = useReducer(reducer, initial);
    const { tmdbtoken, usertoken, userInfo } = useUserContext();
    const {movie , setMovie}= useMovieContext();
    const { movieId } = useParams();
    const [photos, setPhotos] = useState({ posters: [], backdrops: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // alert(movie.tmdbId)
    const fetchphoto = useCallback(() =>{ 
        
        setLoading(true);
        setError("");
        axios({
            method: "get",
            url: `https://api.themoviedb.org/3/movie/${movie.tmdbId}/images`,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${tmdbtoken}`,
            },
        })
            .then((res) => {
                setPhotos({
                   posters:res.data.posters|| [],
                   backdrops: res.data.backdrops|| [],
                });
                 console.log(res.data);
            })
            .catch((err) => {
                setError("Failed to fetch cast and crew.");
                console.error(err);
            })
            .finally(() => setLoading(false));
    } ,[movie,movieId,tmdbtoken])

    useEffect(()=>{
        fetchphoto()
    },[])
    
    const handlesave = async (image , backdrops= true) => {
            
        const newEntry= {
            useId :userInfo.userId ,
            movieId:movieId ,
            description: backdrops? 'Backdrop': 'Poster',
            url :image.file_path?   `https://image.tmdb.org/t/p/original${image.file_path}`:'no url',
           
        };
        try {
            const res = await axios.post("/admin/photos", newEntry, {
                headers: {
                    Authorization: `Bearer ${usertoken}`,
                },
            });
            dispatch({ type: actions.CREATE, payload: res.data });
            alert("Added  Photo Successfully!");
        } catch (error) {
            console.error("Error adding to database:", error.message);
            alert("Failed to add to database.");
        }
     
    };
    const read = useCallback(() => {
        dispatch({ type: actions.FETCH_REQUEST });
        axios
            .get(`/movies/${movieId}`)
            .then((res) => {
                 
                const data = Array.isArray(res.data) ? res.data.photos : [res.data.photos];
                dispatch({ type: actions.FETCH_SUCCESS, payload: data  });
            })
            .catch((err) => {
            });
    }, [movieId]);

 useEffect(()=>{
    read()
 },[state.items])


    return(
        <> 
        <div className="photos-container" >
            {state.loading && <p>Loading...</p>}
            {state.error && <p>Error: {state.error}</p>}
            {photos.backdrops.map((item, index) => (
                <div
                    key={index}
                    className="photo-card"
                    onMouseEnter={(e) => {
                        e.currentTarget.querySelector(".info").style.display =
                            "block";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.querySelector(".info").style.display =
                            "none";
                    }}
                    
                >
                    <img
                        src={`https://image.tmdb.org/t/p/w500${item.file_path}`}
                        alt="Movie Backdrop"
                        className="photo-image"
                    />
                    <div className="info" >
                        <p>URL: {`https://image.tmdb.org/t/p/original${item.file_path}`}</p>
                         <button className="savebutton"  onClick={() => handlesave(item,true)} >Add</button>
                   
                    </div>
                    
                </div>
            ))}
        </div>
        </>
    );
};

export default Photos;

