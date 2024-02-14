import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"

//School Listing
import SchoolListing from "pages/SchoolListing"
//School Details
import SchoolDetails from "pages/SchoolListing/ViewDetails"

//Teacher Details
import StudentDetails from "pages/StudentListing/ViewDetails"

//Teacher Details
import TeacherDetails from "pages/TeacherListing/ViewDetails"

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },

  // //profile
  { path: "/profile", component: UserProfile },

  //school listing
  { path: "/school-listing/area/:ar_id?", component: SchoolListing },
  //school details
  { path: "/schools-listing/view/:sc_id?", component: SchoolDetails },

  //teacher details
  { path: "/teachers/view/:tc_id?", component: TeacherDetails },

  //student details
  { path: "/students/view/:st_id?", component: StudentDetails },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
]

export { publicRoutes, authProtectedRoutes }
