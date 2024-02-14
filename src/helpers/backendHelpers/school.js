import { getApiConfig } from "helpers/authHelper"
import { get } from "../api_helper"
import * as url from "../url_helper"

export const getAllSchool = ar_id => {
  return get(`${url.SCHOOL}?ar_id=${ar_id}`, getApiConfig())
}

export const getSchool = id => {
  return get(`${url.SCHOOL}/${id}`, getApiConfig())
}
