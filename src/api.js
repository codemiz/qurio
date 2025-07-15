import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
})
 export const register = (data) => api.post("/api/register" , data)
 export const login = (data) => api.post("/api/login" , data)
 export const deleteAccount = (userID) => api.post("/delete/user/account" , {userID})
 export const getUser = () => api.get("/user")
 export const logout = () => api.post("/api/logout")
 export const getMessages =(friendID) => api.get(`/messages/${friendID}`)
 export const getChatPreviews = () => api.get("/chat-previews")
 export const uploadAvatar = (data) => api.post("/change/avatar" , data , {
    headers: {
        "Content-Type" : "multipart/form-data"
    }
    })