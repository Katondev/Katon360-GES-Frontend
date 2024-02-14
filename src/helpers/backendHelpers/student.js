import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../url_helper"

export const getAllStudent = schoolId => {
  return get(`${url.STUDENTS}?st_schoolId=${schoolId}`, getApiConfig())
}

export const getStudent = id => {
  return get(`${url.STUDENTS}/${id}`, getApiConfig())
}
