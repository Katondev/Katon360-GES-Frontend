import { get, post, put, del } from "./api_helper"
import * as url from "./url_helper"
import { getApiConfig } from "./authHelper"

export const loginUser = reqBody => {
  return post(url.USER_LOGIN, reqBody, {})
}

export const logoutUser = () => {
  return del(url.USER_LOGOUT, getApiConfig())
}
