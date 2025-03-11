import axios from "axios"
import type { ParamValue } from "vue-router"

const baseUrl='http://localhost:8081/api'

export const stockRatingService={
    getAll(params?:URLSearchParams){
        console.log(params)
        return axios.get(`${baseUrl}/v1/stock`, {params:params})
    },
    getHighestTagetsNow(){
        return axios.get(`${baseUrl}/v1/stock?sortBy=target_to, time&order=desc, asc&offset=0&limit=7&rating_to=Hold`)
    }

}