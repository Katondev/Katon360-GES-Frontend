import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Button,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Card,
  CardImg,
  CardText,
  CardBody,
} from "reactstrap"
import AttendanceChart from "./AttendanceChart"
import ExamScoreChart from "./ExamScoreChart"
import ExamScoreChart1 from "./ExamScoreChart1"
import Notifications from "./Notifications"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getStudent } from "helpers/backendHelpers/student"
import { IMAGE_URL } from "helpers/url_helper"
import default_profile from "../../assets/images/profile-img.png"

const ViewDetails = props => {
  const [studentData, setStudentData] = useState({})
  const [activeAreaTab, setActiveAreaTab] = useState(1)

  const { st_id } = useParams()
  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    if (st_id) {
      try {
        let response = await getStudent(st_id)
        let { student } = response.data
        setStudentData(student)
      } catch (error) {
        let message =
          error?.response?.data?.message ||
          error?.message ||
          "There was problem fetching student"
        return SaveToast({ message, type: "error" })
      }
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row className="mt-3">
            <Col className="text-info">
              <span style={{ fontSize: "2rem" }}>
                {studentData.st_fullName}{" "}
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
                      className="img-fluid"
                      style={{ objectFit: "cover", maxHeight: "200px" }}
                      src={
                        studentData.st_profilePic
                          ? `${IMAGE_URL}/${studentData.st_profilePic}`
                          : default_profile
                      }
                      // src={`${studentData?.st_profilePic?:${default_profile}}`}
                      alt={studentData.st_fullName}
                    />
                  </Col>

                  <Col md={9}>
                    <CardBody>
                      <Row>
                        <Col></Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <CardText>
                            Status:{" "}
                            <i
                              className={`mdi mdi-circle text-${
                                studentData.st_status ? "success" : "danger"
                              } align-middle me-1`}
                            />
                            {studentData.st_status ? "Active" : "Inactive"}
                          </CardText>
                          <CardText>
                            ClassRoom:{" "}
                            {studentData.st_classRoom
                              ? `${studentData.st_classRoom.cr_class}-${studentData.st_classRoom.cr_division}`
                              : ""}
                          </CardText>
                          <CardText>
                            Area Of Study: {studentData?.st_areaOfStudy}
                          </CardText>
                          <CardText>
                            PhoneNumber: {studentData.st_phoneNumber}
                          </CardText>
                          <CardText>Email: {studentData.st_email}</CardText>
                        </Col>
                        <Col md={4}>
                          {/* <CardText>Classroom: {studentData.classroom}</CardText> */}

                          <CardText>Address: {studentData.st_address}</CardText>
                          <CardText>
                            Area:{" "}
                            {`${
                              studentData.st_circuit
                                ? `${studentData.st_circuit},`
                                : ""
                            }${
                              studentData.st_district
                                ? `${studentData.st_district},`
                                : ""
                            } ${studentData.st_region}`}
                          </CardText>
                          <CardText>
                            Date Of Birth: {studentData.st_dateOfBirth}
                          </CardText>
                          <CardText>
                            Parent Name: {studentData.st_parentName}
                          </CardText>
                          <CardText>
                            Parent Email: {studentData.st_parentEmail}
                          </CardText>
                        </Col>
                        <Col md={4}>
                          <CardText>
                            Country Code: {studentData?.st_countryCode}
                          </CardText>
                          <CardText>
                            Alt PhoneNumber: {studentData.st_altPhoneNumber}
                          </CardText>
                          <CardText>
                            Alt Email: {studentData.st_altEmail}
                          </CardText>
                          <CardText>
                            Blood Group: {studentData.st_bloodGroup}
                          </CardText>
                          <CardText>
                            Curriculum Activities:{" "}
                            {studentData.st_curricularActivities}
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
                Exam Score
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeAreaTab === 3 && "active"}
                onClick={() => {
                  setActiveAreaTab(3)
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
                <Col md={6} sm={12} xs={12}>
                  <Card>
                    <CardBody>
                      <ExamScoreChart />
                    </CardBody>
                  </Card>
                </Col>
                <Col md={6} sm={12} xs={12}>
                  <Card>
                    <CardBody>
                      <ExamScoreChart1 />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId={3}>
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
