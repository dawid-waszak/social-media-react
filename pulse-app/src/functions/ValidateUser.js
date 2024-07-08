import { useContext } from "react";
import { UserContext } from "../context/UserContextProvider";

const ValidateUser = async () => {
    try{
        return await fetch("http://localhost:3000/updateUser", {
            method: 'GET',
            credentials: 'include' // Make sure to include credentials in the request
        })
            .then(response => response.json())
            .then(data => {return data})
    }catch{
        console.log("Error in connection");
    }
}

export default ValidateUser