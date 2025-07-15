import { createContext , useContext , useState , useEffect } from "react";
import { getUser ,getChatPreviews } from "../api";
import socket from "../web-sockets/socket";
const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const [loading, setloading] = useState(true)
     

    useEffect(() => {
        getUser()
        .then((res) => {
            const userData = res.data.user
            setUser(userData)
           
        })
        .catch(()=>setUser(null))
        .finally(()=>setloading(false))
    }, [])

    useEffect(() => {
      socket.on("connect" , ()=>{
     

        
      })
      return () => {
        socket.off("connect")
      }
    }, [])

    useEffect(() => {
        
        if(user && socket.connected){
            socket.emit("join" , user._id)
        }
    }, [user])
    
    

    return (
        <AuthContext.Provider value={{user,setUser , loading}}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = () => useContext(AuthContext)