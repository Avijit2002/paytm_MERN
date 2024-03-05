import { useEffect } from "react";
import { useNavigate } from "react-router-dom"


function DashboardPage() {

    const navigate = useNavigate();
    console.log("hii")

    
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            console.log("hii")
           navigate("/signin")
        }
    },[])

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default DashboardPage
