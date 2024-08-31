
import './Name.css';
function Name({Fname, Lname}) {
    return( 
        <div>
         <h1 className='text-gray'><span className="Fname"> {Fname} </span><span className="Lname
         ">{Lname
}</span></h1>
         
        </div>
    )
}
export default Name; 