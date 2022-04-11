import axios from "axios"

export const axiosInstance = axios.create({
    // baseURL: "https://my-warehouse-app-heroku.herokuapp.com/api/"
    baseURL: "http://localhost:8050/api/"
})

export const refFirestore = "https://firebasestorage.googleapis.com/v0/b/magazzino-2a013.appspot.com/o/files%2F"