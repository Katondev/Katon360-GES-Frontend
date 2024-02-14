export const getAuthToken = () => {
  return localStorage.getItem("gesAuthToken") || ""
}

export const setAuthToken = token => {
  if (!token) {
    return false
  }
  localStorage.setItem("gesAuthToken", token)
  return true
}

export const removeAuthToken = () => {
  localStorage.removeItem("gesAuthToken")
  return true
}

export const getUserInfo = () => {
  let userInfo = localStorage.getItem("gesUserInfo")
  return userInfo ? JSON.parse(userInfo) : null
}

export const setUserInfo = userInfo => {
  if (!userInfo) {
    return false
  }

  userInfo = JSON.stringify(userInfo)
  localStorage.setItem("gesUserInfo", userInfo)
  return true
}

export const removeUserInfo = () => {
  localStorage.removeItem("gesUserInfo")
  return true
}

export const getApiConfig = isFormData => {
  let config = {}
  let token = getAuthToken()

  if (token) {
    let headers = {}
    if (isFormData) {
      headers = {
        "Content-Type": `multipart/form-data`,
        authorization: token,
      }
    } else {
      headers = {
        authorization: token,
      }
    }

    config = {
      ...config,
      headers,
    }
  }
  return config
}
