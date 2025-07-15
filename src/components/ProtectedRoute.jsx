import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({children}) =>{
    const {user , loading}= useAuth()

    if (loading) return <Loading />
    return user ? children : <Navigate to="/login" />
};

export default ProtectedRoute