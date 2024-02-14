import axios from "axios"
import { API_URL_GES_AREA } from "./url_helper"

const axiosApi = axios.create({
  baseURL: API_URL_GES_AREA,
})

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export const get = async (url, config = {}) => {
  return axiosApi.get(url, { ...config }).then(response => response.data)
}
