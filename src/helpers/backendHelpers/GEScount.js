import { getApiConfig } from "helpers/authHelper"
import { get, put } from "../api_helper"
import * as url from "../url_helper"

export const countData = (region, district, circuit) => {
  return get(
    `${url.GESCOUNT}?region=${region}&district=${district}&circuit=${circuit}`,
    getApiConfig()
  )
}
export const getGESMember = async () => {
  return get(`${url.GESMEMBER}`, getApiConfig())
}

export const updateGESMemberProfile = async data => {
  return put(`${url.GESMEMBER}`, data, getApiConfig())
}
