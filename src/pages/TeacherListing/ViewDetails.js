import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Button,
  Col,
  Row,
  Table,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  Container,
  TabPane,
} from "reactstrap"
import Lightbox from "react-image-lightbox"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import AttendanceChart from "./AttendanceChart"
import "react-image-lightbox/style.css"
import Notifications from "./Notifications"
import { getTeacher } from "helpers/backendHelpers/teacher"
import { IMAGE_URL } from "helpers/url_helper"
import default_profile from "../../assets/images/profile-img.png"

const ViewDetails = props => {
  const [teacherData, setTeacherData] = useState({})
  const [isEffects, setisEffects] = useState(false)
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  const { tc_id } = useParams()
  useEffect(() => {
    fetchTeacherData()
  }, [])

  const fetchTeacherData = async () => {
    if (tc_id) {
      try {
        let response = await getTeacher(tc_id)
        let { teacher } = response.data
        setTeacherData(teacher)
      } catch (error) {
        let message =
          error?.response?.data?.message ||
          error?.message ||
          "There was problem fetching teacher"
        return SaveToast({ message, type: "error" })
      }
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {isEffects ? (
            <Lightbox
              mainSrc={`${IMAGE_URL}/${teacherData?.tc_degreeCertificate}`}
              enableZoom={false}
              onCloseRequest={() => {
                setisEffects(!isEffects)
              }}
            />
          ) : null}
          <Row className="mt-3">
            <Col>
              <span className="text-info" style={{ fontSize: "2rem" }}>
                {teacherData.tc_fullName}{" "}
              </span>
            </Col>
            <Col className="text-end">
              <Button
                color="dark"
                onClick={() => {
                  props.history.goBack()
                }}
              >
                Back
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} className="mb-3">
              <Card>
                <Row className="no-gutters align-items-center">
                  <Col md={3}>
                    <CardImg
                      style={{ objectFit: "cover", maxHeight: "240px" }}
                      className="img-fluid"
                      src={
                        teacherData.tc_profilePic
                          ? `${IMAGE_URL}/${teacherData.tc_profilePic}`
                          : default_profile
                      }
                      alt={teacherData.tc_fullName}
                    />
                  </Col>
                  <Col md={9}>
                    <CardBody>
                      <Row>
                        <Col md={4}>
                          <CardText>
                            Status:{" "}
                            <i
                              className={`mdi mdi-circle text-${
                                teacherData.tc_status ? "success" : "danger"
                              } align-middle me-1`}
                            />
                            {teacherData.tc_status ? "Active" : "Inactive"}
                          </CardText>
                          <CardText>
                            Staff Id: {teacherData.tc_staffId}
                          </CardText>
                          <CardText>
                            Phone Number: {teacherData.tc_phoneNumber}
                          </CardText>
                          <CardText>Email: {teacherData.tc_email}</CardText>
                          <CardText>
                            Country Code: +{teacherData.tc_countryCode}
                          </CardText>

                          <CardText>
                            Area:{" "}
                            {`${
                              teacherData.tc_circuit
                                ? `${teacherData.tc_circuit},`
                                : ""
                            }${
                              teacherData.tc_district
                                ? `${teacherData.tc_district},`
                                : ""
                            } ${
                              teacherData.tc_region ? teacherData.tc_region : ""
                            }`}
                          </CardText>
                        </Col>
                        <Col md={4}>
                          <CardText>
                            Alt Phone Number:{teacherData.tc_altPhoneNumber}
                          </CardText>
                          <CardText>
                            Alt Email: {teacherData.tc_altEmail}
                          </CardText>
                          <CardText>
                            Alt Phone Number: {teacherData.tc_altPhoneNumber}
                          </CardText>
                          <CardText>
                            Education: {teacherData.tc_education}
                          </CardText>
                          <CardText>Address: {teacherData.tc_address}</CardText>
                          <CardText>
                            Dat Of Birth: {teacherData.tc_dateOfBirth}
                          </CardText>
                        </Col>
                        <Col md={4}>
                          <CardText>
                            <img
                              src={`${IMAGE_URL}/${teacherData?.tc_degreeCertificate}`}
                              alt="Degree Certificate"
                              onClick={() => {
                                setisEffects(true)
                              }}
                              className="avatar-lg img-thumbnail"
                            />
                          </CardText>
                          <CardText>
                            Blood Group: {teacherData.tc_bloodGroup}
                          </CardText>
                        </Col>
                      </Row>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Nav tabs>
            <NavItem>
              {" "}
              <NavLink
                className={activeAreaTab === 1 && "active"}
                onClick={() => {
                  setActiveAreaTab(1)
                }}
              >
                Attendance
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeAreaTab === 2 && "active"}
                onClick={() => {
                  setActiveAreaTab(2)
                }}
              >
                Notifications
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeAreaTab}>
            <TabPane tabId={1}>
              <Row className="mt-3">
                <Col>
                  <Card>
                    <CardBody>
                      <AttendanceChart />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId={2}>
              <Row className="mt-3">
                <Col>
                  <Card>
                    <CardBody>
                      <Notifications />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ViewDetails
