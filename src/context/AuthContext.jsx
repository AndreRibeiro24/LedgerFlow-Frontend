import {createContext, useState} from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api.js"
export const AuthContext = createContext()

export default function AuthProvider({children}){
    const[user,setUser] = useState(null)
    const[loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const login = async (body)=>{
        try{
            setLoading(true)
            const response = await api.post("/auth/login", body)
            if(response.status === 200){
                setUser(response.data.user)
                localStorage.setItem("authToken", response.data.token)
                navigate("/dashboard")
            }
        }catch(error){
          console.error("LOGIN ERROR:", error);
          console.error("RESPONSE:", error.response);
          console.error("MESSAGE:", error.message);
        }finally{
            setLoading(false)   
        }
    }
return(
    <AuthContext.Provider
    value={{
        user,
        loading,
        login
    }}
    >
        {children}
    </AuthContext.Provider>
)
}