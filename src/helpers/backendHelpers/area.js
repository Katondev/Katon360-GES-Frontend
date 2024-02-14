import { getApiConfig } from "helpers/authHelper"
import { get } from "../api_helper_area"
import * as url from "../url_helper"

export const getAllRegion = () => {
  return get(url.REGION, getApiConfig())
}

export const getAllDistrict = () => {
  return get(url.DISTRICT, getApiConfig())
}

export const getAllCircuit = (region, district, circuit) => {
  return get(
    `${url.CIRCUIT}?region=${region}&district=${district}&circuit=${circuit}`,
    getApiConfig()
  )
}
