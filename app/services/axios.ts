import Axios from "axios"
import { ACCESS_TOKEN } from "@app/modules/market-place/config/constant"
import { getStorage } from "@app/modules/market-place/utils/helper"

const axios = Axios.create({
  baseURL: "https://api.kopis.puravidabitcoin.io/",
})

axios.interceptors.request.use(
  async (config) => {
    const token = await getStorage(ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axios
