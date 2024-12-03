import { useEffect } from "react";
import { useUserContext } from "../../../context/UserContext";
import { useDebounce } from "../../../utils/hooks/useDebounce";
 
function Dashboard() {
 useEffect(() =>{
 },[])
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <p>Child component</p>
    </div>
  );
}

export default Dashboard;
