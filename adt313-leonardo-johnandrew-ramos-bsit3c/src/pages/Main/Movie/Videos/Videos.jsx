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
    const [form , setForm] = useState(null)
    const [file , setFile] = useState()
    const [isUpload, setUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [id] = useState(4)
    const BASE_URL = 'http://localhost:3000';
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

        if(setUpload === true){
            setForm((prev)=>({
                ...prev,
                movieId: movieId, 
                name:editInfo.name,
                site:editInfo.site,
                videoType:editInfo.videoType,
                videoKey:editInfo.videoKey,
                official:editInfo.official
                
            }))
            
            const received = form(
                form,
               "videos"
            )
            if(!received){
                alert("Invalid File")
                return;
            }

            try {
                
               const res = await axios.post(`/videos/${editInfo.id}}` ,received, {
                headers: {
                    Authorization: `Bearer${usertoken}`,
                    "Content-Type":"multipart/form-data"
                },
               });
               dispatch({type:actions.UPDATE, payload: res.data})
               alert("Updated successfully!")
               setUpload(false); 
                
            } catch (error) { 
              console.error("Error Updating Photos;", error.message)
              alert("Failed to Update")
            }
        }else{ 
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
    }
    };
     
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/videos/${id}`, {
                headers: { Authorization: `Bearer ${usertoken}` },
            });
            dispatch({ type: actions.DELETE_CAST, payload: id });
            alert("Deleted successfully!");
        } catch (error) {
            console.error("Error Videos cast:", error.message);
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
                        <iframe src={item.url&&item.url.startsWith('http')? item.url :`${BASE_URL}/${item.url}`}  title={item.name} className="video" />
                        <p>{item.name}</p>

                        <div className="info"        
                        ><button 
                        onClick={() => handleEditClick(item)}
                        >Edit </button>
                        <button
                        onClick={()=>handleDelete(item.id)}
                        >
                         delete
                        </button>
                        </div>

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
                 
                 <label>
            {isUpload ? (
              <>
                File:
                <input
                  type="file"
                  onChange={(e) => {
                    const files = e.target.files[0];
                    if (files) {
                      if (!files || (files.type !== "video/mp4" && files.type !== "video/mpg"
                        && files.type !== "video/mpeg"
                      )) {
                        alert("Only mp4, mpg, mpeg files are allowed.");
                        return;
                     }
                      setForm((prev) => ({
                        ...prev,
                        file: files,
                      }));
                    }
                  }}
                />
              </>
            ) : (
              <>
                URL:
                <input
                  type="text"
                  value={editInfo.url || ""}
                  onChange={(e)=>setEditInfo((prev)=>({
                    ...prev,
                    url: e.target.value
                  }))}
                />
              </>
            )}
          </label>
                    <label>Site</label>
                    <input 
                       type="text"
                       value={editInfo.site}
                       onChange={(e)=>
                        setEditInfo({...editInfo, site: e.target.value})
                       }
                    />
                     <label>VideoType</label>
                      <input 
                       type="text"
                       value={editInfo.videoType}
                       onChange={(e)=>
                        setEditInfo({...editInfo, videoType: e.target.value})
                       }
                     />
                      <label>VideoKey</label>
                      <input 
                       type="text"
                       value={editInfo.videoKey}
                       onChange={(e)=>
                        setEditInfo({...editInfo, videoKey: e.target.value})
                       }
                     />
                        <label>
                <input
                  type='radio'
                  name='role'
                  value={editInfo.official}
                  checked={editInfo.official == true}
                  onChange={(e) => setEditInfo({...editInfo, official: editInfo? true :false})}
                />
                Official
              </label>
                                        
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

