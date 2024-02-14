import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap"

// Formik Validation
import * as Yup from "yup"
import { useFormik } from "formik"

//redux
import { useSelector, useDispatch } from "react-redux"

import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"
import UpdateModal from "components/Common/UpdateModal"

import avatar from "../../assets/images/users/avatar-1.jpg"
// actions
import { editProfile, resetProfileFlag } from "../../store/actions"
import {
  getGESMember,
  updateGESMemberProfile,
} from "helpers/backendHelpers/GEScount"
import { SaveToast } from "components/Common/SaveToast"
import { getUserInfo } from "helpers/authHelper"

const UserProfile = props => {
  //meta title
  document.title = "Profile | Skote - React Admin & Dashboard Template"

  const dispatch = useDispatch()

  const [email, setemail] = useState("")
  const [name, setname] = useState("")
  const [idx, setidx] = useState(1)

  const [save, setSaved] = useState(false)
  const [isEdit, setIsEdit] = useState(true)
  const [updateModal, setUpdateModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const [form, setForm] = useState({
    gm_fullName: "",
    gm_region: "",
    gm_district: "",
    gm_circuit: "",
    gm_designation: "",
    gm_email: "",
    gm_phoneNumber: "",
    gm_authorityType: "",
    gm_gesOffice: {},
  })

  const { error, success } = useSelector(state => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }))

  useEffect(() => {
    if (getUserInfo()) {
      const obj = getUserInfo()
      setname(obj.gm_fullName)
      setemail(obj.gm_email)
      setidx(obj.gm_id)
      setname(obj.gm_fullName)
      setemail(obj.gm_email)
      setidx(obj.gm_id)
    }
  }, [])
  useEffect(() => {
    fetchEditGESMemberDetails()
  }, [isEdit])

  const region = form.gm_gesOffice?.go_region
  const district = form.gm_gesOffice?.go_district
  const circuit = form.gm_gesOffice?.go_circuit

  const RDC = `${
    region === null || region === undefined ? "Region" : region
  } / ${
    district === null || district === undefined ? "District" : district
  } / ${circuit === null || circuit === undefined ? "Circuit" : circuit}`

  const fetchEditGESMemberDetails = async () => {
    try {
      const response = await getGESMember()

      let { authorityMember } = response.data || {}
      authorityMember = authorityMember || {}

      return setForm(authorityMember)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching GESMember details"

      setForm(form)
      return SaveToast({ message, type: "error" })
    }
  }

  const handleUpdateGESMember = () => {
    setUpdateModal(false)
    SaveToast({ message: "GESMember Updated Successfully", type: "success" })
    props.history.push("/dashboard")
  }
  const handleEditGESMemberubmit = async data => {
    try {
      setSubmitLoading(true)
      const response = await updateGESMemberProfile(data)
      let message = response?.message || "GESMEmber Updated Successfully"
      SaveToast({ message, type: "success" })
      setSubmitLoading(false)
      props.history.push("/dashboard")
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Updating GESMEmber"
      setSubmitLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      gm_fullName: form.gm_fullName || "",
      gm_designation: form.gm_designation || "",
      gm_phoneNumber: form.gm_phoneNumber || "",
      gm_email: form.gm_email || "",
      idx: idx || "",
    },
    validationSchema: Yup.object({
      gm_fullName: Yup.string().required("Please Enter Your UserName"),
      gm_designation: Yup.string().required("Please Enter Your designation"),
      gm_email: Yup.string().email().required("Please Enter Email"),
      gm_phoneNumber: Yup.string()
        .required("Please Enter Phone Number")
        .matches(new RegExp(/^[0-9]{10}$/), "Please Enter Valid Phone Number"),
    }),
    onSubmit: values => {
      let gesMemberData = values
      if (isEdit) {
        return handleEditGESMemberubmit(gesMemberData)
      }
    },
  })

  return (
    <React.Fragment>
      <UpdateModal
        show={updateModal}
        onUpdateClick={handleUpdateGESMember}
        onCloseClick={() => setUpdateModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumb title="Skote" breadcrumbItem="Profile" /> */}

          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">{RDC}</h4>

            <Col className="text-end">
              <Button
                color="dark"
                onClick={() => {
                  props.history.push("/dashboard")
                }}
              >
                Back
              </Button>
            </Col>
          </div>

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="dark">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{form.gm_fullName}</h5>
                        <p className="mb-1">{form.gm_email}</p>
                        <p className="mb-0">Id no: #{idx}</p>
                      </div>
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>Area</h5>
                        <p className="mb-1">
                          Region-District-Circuit:
                          {RDC}
                        </p>
                        <p className="mb-0">
                          OfficeLevel: {form.gm_gesOffice?.go_officeLevel}
                        </p>

                        <p className="mb-0"></p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Edit GESMember-Profile</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={e => {
                  e.preventDefault()
                  validation.handleSubmit()
                  return false
                }}
              >
                <div className="form-group">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="gm_fullName"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.gm_fullName || ""}
                    invalid={
                      validation.touched.gm_fullName &&
                      validation.errors.gm_fullName
                        ? true
                        : false
                    }
                  />
                  {validation.touched.gm_fullName &&
                  validation.errors.gm_fullName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.gm_fullName}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Designation</Label>
                  <Input
                    name="gm_designation"
                    className="form-control"
                    placeholder="Enter Designation"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.gm_designation || ""}
                    invalid={
                      validation.touched.gm_designation &&
                      validation.errors.gm_designation
                        ? true
                        : false
                    }
                  />
                  {validation.touched.gm_designation &&
                  validation.errors.gm_designation ? (
                    <FormFeedback type="invalid">
                      {validation.errors.gm_designation}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Phone Number</Label>
                  <Input
                    name="gm_phoneNumber"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.gm_phoneNumber || ""}
                    invalid={
                      validation.touched.gm_phoneNumber &&
                      validation.errors.gm_phoneNumber
                        ? true
                        : false
                    }
                  />
                  {validation.touched.gm_phoneNumber &&
                  validation.errors.gm_phoneNumber ? (
                    <FormFeedback type="invalid">
                      {validation.errors.gm_phoneNumber}
                    </FormFeedback>
                  ) : null}
                </div>

                <div className="form-group mt-2">
                  <Label className="form-label">Email</Label>
                  <Input
                    name="gm_email"
                    className="form-control"
                    placeholder="Enter Email"
                    type="email"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.gm_email || ""}
                    invalid={
                      validation.touched.gm_email && validation.errors.gm_email
                        ? true
                        : false
                    }
                  />
                  {validation.touched.gm_email && validation.errors.gm_email ? (
                    <FormFeedback type="invalid">
                      {validation.errors.gm_email}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-dark save-user"
                    disabled={submitLoading}
                  >
                    Update
                  </button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(UserProfile)
