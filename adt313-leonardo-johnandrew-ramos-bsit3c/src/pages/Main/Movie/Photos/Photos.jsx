import { useEffect, useReducer, useState } from "react";
import { useUserContext } from "../../../../context/UserContext";
import { useParams } from "react-router-dom";
import { useCallback } from "react";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import { useMovieContext } from "../../../../context/MovieContext";
import './Photos.css'
import { forms } from "../../../../functions/formdata";
import { use } from "react";
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
    const [editInfo, setEditInfo] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // const[id] =useState(5);
    let  send = { };
    const [form , setForm] = useState(null) 
    const [file , setFile] = useState()
    const [upload ,setUpload] = useState(false);
    const [preview ,setPreview] = useState(null)
    const BASE_URL = 'http://localhost:3000';
    // const [url , seturl] = useState();
    // const imageUrl = ;
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
     
    const file_drop = (e)=>{
      e.preventDefault();

      const files = e.dataTransfer.files[0];
      if (files) {
        if (!files || (files.type !== "image/png" && files.type !== "image/jpeg"
          && files.type !== "image/jpg"
          && files.type !== "image/gif"
        )) {
          alert("Only PNG  JPEG GIF OR JPG files are allowed.");
          return;
       }
        setPreview( URL.createObjectURL(files));  //preview
    }
     setForm((prev)=>({
      ...prev ,
      file : files,
      movieId:movieId,
      userId : userInfo.userId

     }))

    }

    const handlesave = async (image , backdrops= true, isUpload = true) => {
    
      if(isUpload){ 
        
        const received = forms(form,"photos","create");
        // console.log("received: ", received );
        if (!received) {
          alert("Invalid file or form data.");
          return; 
       }
       send =received;
      }else{
     
        const newEntry= {
          useId :userInfo.userId ,
          movieId:movieId ,
          description: backdrops? 'Backdrop': 'Poster',
          url :image.file_path?   `https://image.tmdb.org/t/p/original${image.file_path}`:'no url',
           
        };
       send = newEntry;
      }

        try {
            const res = await axios.post("/admin/photos",send, {
                headers: {
                    Authorization: `Bearer ${usertoken}`,
                    Application: 'JSON/Application',
                    "Content-Type": "multipart/form-data"

                },
            });
            dispatch({ type: actions.CREATE, payload: res.data });
            console.log ('send file ',send); 
            setForm(null)
            setFile(null)
            setPreview(null) 
           document.querySelector('.browse .input input').value = ""
            alert("Added  Photo Successfully!");
        } catch (error) {
            console.error("Error adding to database:", error.message);
            alert("Failed to add to database.");
        }
     
    };
    const read = useCallback(() => {
        dispatch({ type: actions.FETCH_REQUEST });
        axios
            .get(`/movies/${movieId}`, {
                headers: { Authorization: `Bearer ${usertoken}` },
            })
            .then((res) => {
                // console.log('Fetched photos:', res.data);
                const data = res.data.photos || []; 
                dispatch({ type: actions.FETCH_SUCCESS, payload: data });
            })
            .catch((err) => {
                console.error('Error fetching photos:', err.message);
                dispatch({ type: actions.FETCH_ERROR, payload: err.message });
            });
    }, [movieId, usertoken]);
    
    useEffect(() => {
        read();
    }, [movieId, read,state.items]);
    
    const handleEditClick = (photo) => {
        setEditInfo(photo); // Set the clicked photo for editing
        setUpload(false); // Reset upload state
      };
    
      const handleUpdate = async (e) => {
        if (!editInfo) return;
         

        if(setUpload === true){
          setForm((prev)=>({
            ...prev,
            movieId:movieId,
            // description:editInfo.description
          }))

          const received = forms(
            form,
            "photos"
          );
          // console.log('foernn', form)
        if (!received) {
          alert("Invalid file or form data.");
          return;
       }
            // console.log("recieved: ", received)   
            //post file upload
        try {
          // console.log('files',file)
          const res = await axios.post(`/photos/${editInfo.id}`,received, {
            headers: { 
               Authorization: `Bearer ${usertoken}`,
                "Content-Type": "multipart/form-data"
                 
              },
          });
          dispatch({ type: actions.UPDATE, payload: res.data });
          alert("Updated successfully!")
          setUpload(false);
        } catch (error) {
          console.error("Error updating photo:", error.response?.data);
          alert("Failed to update photo.");
        }
        }else{
          //patch no files
          console.log("ashhgreji",editInfo.description);
          try {
            const res = await axios.patch(`/photos/${editInfo.id}`,editInfo, {
              headers: { 
                 Authorization: `Bearer ${usertoken}`,
                   
                },
            });
            dispatch({ type: actions.UPDATE, payload: res.data });
            setEditInfo(null); // Clear edit state
            setPreview(null)
            setForm(null)
            alert("Updated successfully!");
          
            
          } catch (error) {
            console.error("Error updating photo:", error.response?.data);
            alert("Failed to update photo.");
          }
        }
     
      };
    



    return(
        <> 
      
          <h4 style={
             {
                color: "lightyellow"
             }
         }>This is the suggested photo click add to save </h4>
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
                         <button className="savebutton"  onClick={() => handlesave(item,true,false)} >Add</button>
                   
                    </div>
                    
                </div>
            ))}
        </div>
        <h4 style={
             {
                color: "lightyellow"
             }
         }>Posters </h4>
        <div className="photos-container" >
            {state.loading && <p>Loading...</p>}
            {state.error && <p>Error: {state.error}</p>}
            {photos.posters.map((item, index) => (
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
                         <button className="savebutton"  onClick={() => handlesave(item,false,false)} >Add</button>
                   
                    </div>
                    
                </div>
            ))}
        </div>
       <h4 style={{ color: "lightyellow" }}>Drag Photo</h4>
       {/* {JSON.stringify(file)} */}
        <div className="browse">
           <div className="select"
             onDrop={file_drop}
             onDragOver={(e)=>{e.preventDefault();}}
             onDragEnter={(e)=>{e.preventDefault();}}
             onDragLeave={(e)=>{e.preventDefault();}}
             style={{
              background: preview
              ? `url(${preview}) no-repeat center/contain`
              : "none", 
             }}
           >
           </div>
           <div className="input">
              <input type="text" 
               onChange={(e)=>
                setForm((prev)=>({
                  ...prev ,
                  description: e.target.value
                 }))
            
               }
              />
           </div>
            <div className="save"> 
               <input type="submit" value="save" onClick={handlesave} />
            </div>
        </div>
        <h4 style={{ color: "lightyellow" }}>Current Photo List</h4>
      <div className="photos-container">
        {state.loading && <p>Loading...</p>}
        {state.error && <p>Error: {state.error}</p>}
        {state.items.map((item) => (
          <div
            key={item.id}
            className="photo-card"
            onClick={() => handleEditClick(item)} // Select photo for editing
          >
            
<img src={item.url&&item.url.startsWith('http')? item.url :`${BASE_URL}/${item.url}`} alt="Photos" className="photo-image" /> 
            <div className="info">
              <p>URL: {item.url}</p>
            </div>
          </div>
        ))}
      </div> 
      

      {editInfo && (
        <div className="edit-container">
          <h4>Edit Photo</h4>
          <label>
            Description:
            <input
              type="text"
              value={editInfo.description || ""}
              onChange={(e) =>
                setEditInfo({ ...editInfo, description: e.target.value })
              }
            />
          </label>
          <label>
            {upload ? (
              <>
                File:
                <input
                  type="file"
                  onChange={(e) => {
                    const files = e.target.files[0];
                    if (files) {
                      if (!files || (files.type !== "image/png" && files.type !== "image/jpeg"
                        && files.type !== "image/jpg"
                        && files.type !== "image/gif"
                      )) {
                        alert("Only PNG  JPEG GIF OR JPG files are allowed.");
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
          <button onClick={() => setUpload(!upload)}>
            {upload ? "Switch to URL Input" : "Switch to File Upload"}
          </button>
          <button onClick={handleUpdate}>Save Changes</button>
        </div>
      )}
        </>
    );
};

export default Photos;

