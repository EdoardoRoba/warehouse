import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: "https://my-warehouse-heroku.herokuapp.com/"
})