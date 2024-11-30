import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useReducer } from "react";

const initial={
    items :[],
    loading : false ,
    error: null 
}

const actions = {
    FETCH_REQUEST: "fetch_request",
    FETCH_SUCCESS:"fetch_success",
    FETCH_ERROR:"fetch_error",
    CREATE_CAST :"create_cast",
    UPDATE_CAST : "update_cast",
    DELETE_CAST: "update_cast",
}

const reducer = (state , action)=>{
    switch(action.type){
        case actions.FETCH_REQUEST:
              return{
                 ...state,
                 loading: true,
                 error:null
              };
        case  actions.FETCH_SUCCESS:
       
        
            return{
                ...state,
                loading:false,
                items:action.payload
            };
        case actions.FETCH_ERROR:
            return{
                ...state,
                loading:false,
                error:action.payload
            };
        case actions.CREATE_CAST:
            return{
                ...state,
                items:[...state.items, action.payload],
            };
        case actions.UPDATE_CAST:
            return{
                ...state,
                items:state.items.map((item) =>
                  item.id===action.payload.id ?action.payload: item
                ),
            } ;
        default:
            return state;
    }
}

const CRUDReducer = () =>{
    const [state , dispatch] = useReducer(reducer , initial);
    const [cast , setCast] = useState("");

    useEffect(()=>{
        const read = async() =>{
             dispatch({type: actions.FETCH_REQUEST});
             try{
                const res = await axios.get(`/movies/38`)
                const data = Array.isArray(res.data) ? res.data : [res.data.cast]; // Ensure array
                dispatch({type:actions.FETCH_SUCCESS , payload :res.data.casts})
                

             }catch(e){
              dispatch({type:actions.FETCH_ERROR ,payload:e.message})
           
             }
             
        }
       read(); 
       console.log(state.items)

    },[])
    return(
        <>
             {JSON.stringify(state.items)}
        </>
    );
}; export default CRUDReducer