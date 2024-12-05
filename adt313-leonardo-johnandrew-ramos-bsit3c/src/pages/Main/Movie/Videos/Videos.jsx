import { useEffect, useReducer, useState } from "react";
import { useUserContext } from "../../../../context/UserContext";
import { json, useParams } from "react-router-dom";
import { useCallback } from "react";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import { useMovieContext } from "../../../../context/MovieContext";
import './Videos.css'
const initial = {
    items :[],
    loading: false ,
    error: null,
  
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



const Videos = () =>{
         
    const [state, dispatch] = useReducer(reducer, initial);
    const { tmdbtoken, usertoken, userInfo } = useUserContext();
    const  {movie } = useMovieContext(); 
    const { movieId } = useParams();
    const [video, setVideos] = useState({ video : []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    //   alert(movie.tmdbId)
    const fetchphoto = useCallback(() =>{
        
        setLoading(true);
        setError("");
        axios({
            method: "get",
            url: `https://api.themoviedb.org/3/movie/${movie.tmdbId}/videos`,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${tmdbtoken}`,
            },
        })
            .then((res) => {
                setVideos({
                    video:res.data.results|| []
                  
                 });
               
            })
            .catch((err) => {
                setError("Failed to fetch cast and crew.");
                console.error(err);
            })
            .finally(() => setLoading(false));
    } ,[movie,movieId,tmdbtoken])
   

    const handlesave = async (video) => {
            
        const newEntry= {
            userId: userInfo.userId,
            movieId: movieId,
            url:  video.key? `https://www.youtube.com/embed/${video.key}`: 'no url',
            name: video.name ,
            site: video.site,
            videoType:video.type,
            videoKey:video.key,
            official: video.official
            
        };
        try {
            const res = await axios.post("/admin/videos", newEntry, {
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
                const data = Array.isArray(res.data.casts) ? res.data.casts : [res.data.casts];
                dispatch({ type: actions.FETCH_SUCCESS, payload: data , id: res.data.tmdbId});
            })
            .catch((err) => {
            });
    }, [movieId]);

 useEffect(()=>{
    read()
 },[state.items])


    useEffect(()=>{
        fetchphoto()
        console.log(state.items)
    },[])

    return(
        <>

      <div className="video-container">
     
    {state.loading && <p>Loading...</p>}
    {state.error && <p>Error: {state.error}</p>}

    {video.video.map((item) => (
        
            <div
           
                className="video-card"
                onMouseEnter={(e) => {
                    e.currentTarget.querySelector(".info").style.display = "block";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.querySelector(".info").style.display = "none";
                }}
            >
                <iframe
                    src={`https://www.youtube.com/embed/${item.key}`}
                    title={item.name}
                    className="video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
                <div className="info" >
                    <p>Video Name: {item.name}</p>
                    <p>Type: {item.type}</p>
                    <p>official:{item.official==='false'? "True":"False"}</p>
                    <p>Site:{item.site}</p>
                    <button className="savebutton" onClick={()=>{ handlesave(item)}}> add</button>
                </div>
            </div>
        
    ))}
</div>
        {/* {JSON.stringify(state.items)} */}
        </>
    );
};

export default Videos;
