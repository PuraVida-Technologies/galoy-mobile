import Axios from "axios"
import { ACCESS_TOKEN } from "@app/modules/market-place/config/constant"
import { getStorage } from "@app/modules/market-place/utils/helper"

const axios = Axios.create({
  baseURL: "https://api.kopis.puravidabitcoin.io/",
})

axios.interceptors.request.use(
  (config) => {
    getStorage(ACCESS_TOKEN)
      .then((res) => {
        axios.defaults.headers.Authorization = `Bearer ${res}`
      })
      .catch((error) => {
        console.log("error", error)
      })

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axios
