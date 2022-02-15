import axios from "axios"

export const axiosInstance = axios.create({
    // baseURL: "https://my-warehouse-heroku.herokuapp.com/"
    baseURL: "http://localhost:8050/"
})