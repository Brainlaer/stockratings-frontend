import axios from "axios"
import type { ParamValue } from "vue-router"

const baseUrl='http://localhost:8081/api'

export const stockRatingService={
    getAll(params?:URLSearchParams){
        return axios.get(`${baseUrl}/v1/stock`, {params:params})
    },
    getOne(id:string){
        return axios.get(`${baseUrl}/v1/stock/${id}`)
    },
    update(body:any, id:string){
        return axios.put(`${baseUrl}/v1/stock/${id}`,body)
    },
    create(body:any){
        return axios.post(`${baseUrl}/v1/stock`,body)
    },
    delete(id:string){
        return axios.delete(`${baseUrl}/v1/stock/${id}`)
    }

}