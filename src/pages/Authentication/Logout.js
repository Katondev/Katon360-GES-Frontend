import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { withRouter } from "react-router-dom"

import {
  getAuthToken,
  removeAuthToken,
  removeUserInfo,
} from "helpers/authHelper"

import { logoutUser } from "helpers/backendHelper"

const Logout = props => {
  useEffect(() => {
    logoutUser(getAuthToken())
    removeAuthToken()
    removeUserInfo()

    props.history.push("/login")
  }, [])

  return <></>
}

Logout.propTypes = {
  history: PropTypes.object,
}

export default withRouter(Logout)
