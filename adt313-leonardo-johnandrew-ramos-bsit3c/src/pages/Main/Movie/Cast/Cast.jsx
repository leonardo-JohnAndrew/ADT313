import axios from "axios";
import { useEffect, useReducer, useState, useCallback } from "react";
import { useUserContext } from "../../../../context/UserContext";
import { useParams } from "react-router-dom"; 
import './Casts.css'
import { useMovieContext } from "../../../../context/MovieContext";
import Movie from "../Movie";


const initial = {
    items: [],
    loading: false,
    error: null,
    tmdbId: null
};

const actions = {
    FETCH_REQUEST: "fetch_request",
    FETCH_SUCCESS: "fetch_success",
    FETCH_ERROR: "fetch_error",
    CREATE_CAST: "create_cast",
    UPDATE_CAST: "update_cast",
    DELETE_CAST: "delete_cast",
};

const reducer = (state, action) => {
    switch (action.type) {
        case actions.FETCH_REQUEST:
            return {
                 ...state,
                  loading: true, 
                  error: null 
                };
        case actions.FETCH_SUCCESS:
            return { 
                ...state,
                 loading: 
                 false,
                items: action.payload,
                tmdbId: action.id
            
                };
        case actions.FETCH_ERROR:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };
        case actions.CREATE_CAST:
            return { 
                ...state, 
                items: [...state.items, action.payload] 
            };
        case actions.UPDATE_CAST:
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };
        case actions.DELETE_CAST:
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            };
        default:
            return state;
    }
};

const CRUDcrewandcast = () => {
    
    const [state, dispatch] = useReducer(reducer, initial);
    const { tmdbtoken, usertoken, userInfo } = useUserContext();
    const {movie , setMovie} = useMovieContext();
    const { movieId } = useParams();
    const [castCrewResults, setCastCrewResults] = useState({ cast: [], crew: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPagecrew, setCurrentPagecrew] = useState(1);
    const [itemsPerPage] = useState(20);
    const [currentPagecast, setCurrentPagecast] = useState(1);
    const [currentPagedb, setCurrentPagedb] = useState(1);
    
    const [editCast , setEditCast] = useState(null);
    const lastcast = currentPagecast * itemsPerPage ;
    const firstcast = lastcast - itemsPerPage;
    const lastcrew =currentPagecrew * itemsPerPage ;
    const firstcrew = lastcrew -itemsPerPage ;

     

    //filter 
    const filter = (list) => {
        return list.filter((person) => {
            return !state.items.some(
                (item) =>
                    item.name === person.name &&
                    (item.characterName === (person.character || person.job))
            );
        });
    };
     

     const filteredcast = filter(castCrewResults.cast);
     const filteredcrew = filter(castCrewResults.crew);
    //filtered cast
    const castvalue = filteredcast.slice(firstcast, lastcast);
    //filteredd cast
    const crewvalue = filteredcrew.slice(firstcrew,lastcrew);
    //filters db
    // const dbvalue =  state.items.slice(first,last)
  
    const btncountcast = []
    for (let c = 1 ; c<Math.ceil(filteredcast.length/itemsPerPage);c++){
        btncountcast.push(c);
    }
    
    const btncountcrew = []
    for (let c = 1 ; c<Math.ceil(filteredcrew.length/itemsPerPage);c++){
        btncountcrew.push(c);
    }
    const btncountdb = []
    for (let c = 1 ; c<Math.ceil(state.items.length/itemsPerPage);c++){
        btncountdb.push(c);
    }

   
    // console.log(castvalue);
//    alert(userInfo.userId);
      const crewclick =(i)=>{
        setCurrentPagecrew(i);
      }
      const castclick = (i)=>{
         setCurrentPagecast(i);
      }
      const dbclick = (i)=>{
        setCurrentPagedb(i);
      }

    const fetchCastCrew = useCallback(() => {
        if(!state.tmdbId) return ;
        setLoading(true);
        setError("");
        axios({
            method: "get",
            url: `https://api.themoviedb.org/3/movie/${movie.tmdbId}/credits`,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${tmdbtoken}`,
            },
        })
            .then((res) => {
                setCastCrewResults({
                    cast: res.data.cast || [],
                    crew: res.data.crew || [],
                });
            })
            .catch((err) => {
                setError("Failed to fetch cast and crew.");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [state.tmdbId,movieId, tmdbtoken]);

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

    const handlesave = async (person, isCast = true) => {
        const newEntry = {
            useId :userInfo.userId ,
            movieId:movieId ,
            name: person.name,
            characterName: isCast ? person.character : person.job,
            url: person.profile_path
                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                : "",
        };
           
        try {
            const res = await axios.post("/admin/casts", newEntry, {
                headers: {
                    Authorization: `Bearer ${usertoken}`,
                },
            });
            dispatch({ type: actions.CREATE_CAST, payload: res.data });
            alert("Added successfully!");
        } catch (error) {
            console.error("Error adding to database:", error.message);
            alert("Failed to add to database.");
        }
     
    };

    const handleUpdate = async () => {
        if (!editCast) return;

        try {
            const data = {
                movieId: editCast.movieId,
                name : editCast.name ,
                characterName:editCast.characterName,
                url:"",

            }
            const res = await axios.post(`/admin/casts/${editCast.id}`, data, {
                headers: { Authorization: `Bearer ${usertoken}` },
            });
            dispatch({ type: actions.UPDATE_CAST, payload: res.data });
            setEditCast(null);
            alert("Updated successfully!");
        } catch (error) {
            console.error("Error updating cast:", error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/casts/${id}`, {
                headers: { Authorization: `Bearer ${usertoken}` },
            });
            dispatch({ type: actions.DELETE_CAST, payload: id });
            alert("Deleted successfully!");
        } catch (error) {
            console.error("Error deleting cast:", error.message);
        }
    };
    
    useEffect(()=>{
        read();
    },[read])
    useEffect(() => {
        fetchCastCrew();
      
    }, [fetchCastCrew]);
    // console.log("maycasr",castCrewResults.cast)
    // console.log("mycrew",castCrewResults.crew);


    return (
        <div>

            <h2>Suggested Cast & Crew</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div>
                <h3>Cast</h3>
                <table className="table" border="1" >
                    <thead>
                        <tr>  
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Character</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {castvalue.map((person) => (
                            <tr >
                                 <td><img src= {`https://image.tmdb.org/t/p/w500${person.profile_path}`}   alt="none" className="profile" /></td>
                                <td>{person.name}</td>
                                <td>{person.character}</td>
                                <td>
                                    <button  className="savebutton" onClick={() => handlesave(person, true)} >
                                        Add Cast
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>
                    {btncountcast.map((bt)=>(
                        <button onClick={()=>castclick(bt)}>{bt}</button>
                    ))}
                <div>
              
            </div>
            </div>
              
            <div>

                <h3>Crew</h3>
                <table border="1" className="table" >
                    <thead>
                        <tr>
                            <th>Profile </th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crewvalue.map((person) => (
                            <tr >
                                  <td><img src= {`https://image.tmdb.org/t/p/w500${person.profile_path}`}   alt="none"  className="profile" /></td>
                                <td>{person.name}</td>
                                <td>{person.job}</td>
                                <td>
                                    <button className="savebutton"  onClick={() => handlesave(person, false)}>
                                        Add Crew
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {btncountcrew.map((btn)=>(
                  <button onClick={()=>crewclick(btn)}>{btn}</button>
             ))}
            <h2>Database Casts</h2>
            <table border="1" className="table"> 
                <thead>
                    <tr>
                        <th >Profile</th>
                        <th>Name</th>
                        <th>Character/Job</th>
                        <th>Action</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {state.items.map((item)  => (
                        <tr >
                            <td>
                                {editCast?.id === item.id?(
                                 <input className="input" type="" 
                                  
                                 />
                                ):(
                                    <img  className="profile" src= {`https://image.tmdb.org/t/p/w500${item.url}`}   alt="none" />
                                )}
                            </td>
                            <td>
                                {editCast?.id === item.id ? (
                                    <input
                                       className="input"
                                        type="text"
                                        value={editCast.name}
                                        onChange={(e) =>
                                            setEditCast({ ...editCast, name: e.target.value })
                                        }
                                    />
                                ) : (
                                    item.name
                                )}
                            </td>
                            <td>
                                {editCast?.id === item.id ? (
                                    <input
                                        type="text"
                                        className="input"
                                        value={editCast.characterName}
                                        onChange={(e) =>
                                            setEditCast({ ...editCast, characterName: e.target.value })
                                        }
                                    />
                                ) : (
                                    item.characterName
                                )}
                            </td>
                            <td>
                                {editCast?.id === item.id ? (
                                    <button onClick={handleUpdate}>Save</button>
                                ) : (
                                    <button onClick={() => setEditCast(item)}>Edit</button>
                                )}
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {btncountdb.map((btn)=>(
                  <button className="savebutton" onClick={()=>dbclick(btn)}>{btn}</button>
             ))}
        </div>
    );
};

export default CRUDcrewandcast;
