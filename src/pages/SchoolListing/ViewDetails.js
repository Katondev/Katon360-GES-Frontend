import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  CardImg,
  CardText,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Container,
} from "reactstrap"

import StudentList from "../StudentListing/index"
import TeacherList from "../TeacherListing/index"
import ImageSlider from "./ImageSlider"

import { getSchool } from "helpers/backendHelpers/school"

const ViewDetails = props => {
  const [schoolData, setSchoolData] = useState({})
  const { sc_id } = useParams()

  useEffect(() => {
    fetchSchoolData()
  }, [])

  const fetchSchoolData = async () => {
    if (sc_id) {
      try {
        let response = await getSchool(sc_id)
        let { school } = response.data
        setSchoolData(school)
      } catch (error) {
        let message =
          error?.response?.data?.message ||
          error?.message ||
          "There was problem fetching school"
        return SaveToast({ message, type: "error" })
      }
    }
  }
  const [activeAreaTab, setActiveAreaTab] = useState(1)
  return (
    <div className="page-content">
      <div className="container-fluid">
        <Row className="mt-3">
          <Col className="text-info">
            <span style={{ fontSize: "2rem" }}>
              {" "}
              {schoolData.sc_schoolName}{" "}
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
                  <ImageSlider />
                </Col>
                <Col md={9}>
                  <CardBody>
                    <CardTitle className="text-info"></CardTitle>
                    <Row>
                      <Col md={4}>
                        <CardText>
                          Status:{" "}
                          <i
                            className={`mdi mdi-circle text-${
                              schoolData.sc_status ? "success" : "danger"
                            } align-middle me-1`}
                          />
                          {schoolData.sc_status ? "Active" : "Inactive"}
                        </CardText>
                        <CardText>School Id: {schoolData.sc_schoolId}</CardText>
                        <CardText>Type: {schoolData.sc_schoolType}</CardText>
                        <CardText>
                          Mobile No.: {schoolData.sc_phoneNumber}
                        </CardText>
                      </Col>
                      <Col md={4}>
                        <CardText>Email: {schoolData.sc_email}</CardText>
                        <CardText>Address: {schoolData.sc_address}</CardText>
                        <CardText>
                          Alt. Mobile No.: {schoolData.sc_altPhoneNumber}
                        </CardText>
                        <CardText>
                          Head Name: {schoolData.sc_schoolHeadName}
                        </CardText>
                      </Col>
                      <Col md={4}>
                        <CardText>
                          Total Teachers: {schoolData.numberOfTeachers}
                        </CardText>
                        <CardText>
                          Total Students: {schoolData.numberOfStudents}
                        </CardText>
                        <CardText>
                          Region-District-Ciruit:{" "}
                          {`${schoolData.sc_circuit}, ${schoolData.sc_district}, ${schoolData.sc_region}`}
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
              Teachers
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeAreaTab === 2 && "active"}
              onClick={() => {
                setActiveAreaTab(2)
              }}
            >
              Students
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeAreaTab}>
          <TabPane tabId={1}>
            <TeacherList />
          </TabPane>
          <TabPane tabId={2}>
            <StudentList />
          </TabPane>
        </TabContent>
      </div>
    </div>
  )
}

export default ViewDetails
