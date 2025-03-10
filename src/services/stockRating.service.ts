import axios from "axios"

const baseUrl='http://localhost:8081/api'

export const stockRatingService={
    getAll(){
        return axios.get(`${baseUrl}/v1/stock`)
    }
}