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
    const [editInfo ,setEditInfo] = useState(null)
    const [isUpload, setUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [id] = useState(4)
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
                const data = Array.isArray(res.data.casts) ? res.data.videos : [res.data.videos];
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
    },[])
    
    const handleEditClick = (video) => {
        setEditInfo(video); 
    };

    const handleUpdate = async () => {
        if (!editInfo) return;

        try {
            await axios.patch(`/videos/${editInfo.id}`, editInfo, {
                headers: { Authorization: `Bearer ${usertoken}` },
            });
            dispatch({ type: actions.UPDATE, payload: editInfo });
            alert("Video updated successfully!");
            setEditInfo(null); // Clear the edit state
        } catch (err) {
            alert("Failed to update video.");
        }
    };
    return(
        <>
         <h4 style={
             {
                color: "lightyellow"
             }
         }>This is the suggested Video click add to save </h4>
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
                     autoplay
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
        <h4>My Current Videos</h4>
            <div className="video-container">
                {state.items.map((item) => (
                    <div
                        key={item.id}
                        className="video-card"
                        onMouseEnter={(e) => {
                            e.currentTarget.querySelector(".info").style.display = "block";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.querySelector(".info").style.display = "none";
                        }}
                    >
                        <iframe src={item.url} title={item.name} className="video" />
                        <p>{item.name}</p>

                        <div className="info"        
                      onClick={() => handleEditClick(item)}
                        >edit</div>
                    </div>
                
                ))}
                
            </div>

            {editInfo && (
                <div className="edit-form">
                    <h4>Edit Video</h4>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={editInfo.name}
                        onChange={(e) =>
                            setEditInfo({ ...editInfo, name: e.target.value })
                        }
                    />
                    <label>URL:</label>
                    <input
                        type={isUpload ? "file" : "text"}
                        value={isUpload ? undefined : editInfo.url}
                        onChange={(e) =>
                            !isUpload &&
                            setEditInfo({ ...editInfo, url: e.target.value })
                        }
                    />
                         <button onClick={() => setUpload(!isUpload)}>
            {isUpload ? "Switch to URL Input" : "Switch to File Upload"}
          </button>
                    <button onClick={handleUpdate}>Update</button>
                </div>
            )}
        </>
    
    );
};

export default Videos;

