import Axios from "axios"
import { ACCESS_TOKEN } from "@app/modules/market-place/config/constant"
import { storage } from "./storage"

const axios = Axios.create({
  baseURL: "https://api.kopis.puravidabitcoin.io/",
})

axios.interceptors.request.use(
  (config) => {
    const token = storage.getString("ACCESS_TOKEN")
    console.log("token", storage.getAllKeys())
    axios.defaults.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axios
