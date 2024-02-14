import { getApiConfig } from "helpers/authHelper"
import { get, post, put, del } from "../api_helper"
import * as url from "../url_helper"

export const getAllTeacher = schoolId => {
  return get(`${url.SCHOOL_TEACHERS}?tc_schoolId=${schoolId}`, getApiConfig())
}

export const getTeacher = id => {
  return get(`${url.SCHOOL_TEACHERS}/${id}`, getApiConfig())
}
