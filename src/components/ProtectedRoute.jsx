import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({children}) =>{
    const {user , loading}= useAuth()

    if (loading) return <div>loading...</div>
    return user ? children : <Navigate to="/register" />
};

export default ProtectedRoute