import PropTypes from "prop-types"
import React, { useMemo, useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  UncontrolledTooltip,
  Button,
} from "reactstrap"

import TableContainer from "../../components/Common/TableContainer"
import { SimpleStringValue } from "helpers/common_helper_functions"
import { schools } from "common/data/schools"
import { getAllSchool } from "helpers/backendHelpers/school"
import { SaveToast } from "components/Common/SaveToast"

//i18n
import { withTranslation } from "react-i18next"

const Schools = props => {
  document.title = "School | KATon"

  const [schools, setSchools] = useState([])
  const [school, setSchool] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const { ar_id } = useParams()

  let totalTeacher = 0
  let totalStudent = 0
  let circuit = ""
  let RDC = ""

  // sum of Teacher And student
  schools.forEach(school => {
    let teachers = school.sc_teachers
    let students = school.sc_students
    totalTeacher += teachers
    totalStudent += students
  })

  // find circuit by school
  schools.map(school => {
    const schoolCircuit = school.sc_circuit
    const rdcString = `${school.sc_region} / ${school.sc_district}`
    RDC = rdcString
    circuit = schoolCircuit
  })

  const statastics = [
    // {
    //   title: "Circuit Details",
    //   iconClass: "dripicons-location",
    //   description: `${circuit}`,
    // },
    {
      title: "Total Schools",
      iconClass: "bx bxs-school",
      description: `${schools.length}`,
    },
    {
      title: "Total Teachers",
      iconClass: "bx bxs-group",
      description: `${totalTeacher}`,
    },
    {
      title: "Total Students",
      iconClass: "dripicons-user-id",
      description: `${totalStudent}`,
    },
  ]

  useEffect(() => {
    fetchSchoolByRDC()
  }, [])

  const fetchSchoolByRDC = async () => {
    try {
      setLoading(true)
      const response = await getAllSchool(ar_id)
      let { schools } = response.data || {}
      schools = schools || []
      setSchools(schools)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Schools"
      setSchools([])
      setLoading(false)

      return SaveToast({ message, type: "error" })
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "School Name",
        accessor: "sc_schoolName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Type",
        accessor: "sc_schoolType",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Address",
        accessor: "sc_address",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "School Head",
        accessor: "sc_schoolHeadName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Contact No.",
        accessor: "sc_phoneNumber",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Number Of Teachers",
        accessor: "sc_teachers",
        filterable: true,
        Cell: cellProps => {
          return cellProps.row.original.sc_teachers
        },
      },
      {
        Header: "Number Of Students",
        accessor: "sc_students",
        filterable: true,
        Cell: cellProps => {
          return cellProps.row.original.sc_students
        },
      },
      {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-dark"
                onClick={() => {
                  props.history.push(
                    "/schools-listing/view/" + cellProps.row.original.sc_id
                  )
                }}
              >
                <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
                <UncontrolledTooltip placement="top" target="viewtooltip">
                  View
                </UncontrolledTooltip>
              </Link>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">{RDC}</h4>
          <Row className="mt-3">
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
          </Row>
        </div>

        <Row>
          <Col xl="12">
            <Row>
              {/* Statastics Render */}
              {statastics.map((stat, key) => (
                <Col md="4" key={"_col_" + key}>
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">{stat.title}</p>
                          <h4 className="mb-0">{stat.description}</h4>
                        </div>
                        <div className="avatar-sm rounded-circle bg-dark align-self-center mini-stat-icon">
                          <span className="avatar-title rounded-circle bg-dark">
                            <i
                              className={
                                "bx " + stat.iconClass + " font-size-24"
                              }
                            ></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xs="12">
            <Card>
              <CardBody>
                <TableContainer
                  columns={columns}
                  data={schools}
                  isGlobalFilter={true}
                  isAddOptions={false}
                  customPageSize={10}
                  className="custom-header-css"
                  canExportCsv={true}
                  canPrint={true}
                  dataFetchLoading={loading}
                  noDataMessage="No Records Found For Schools"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default withTranslation()(Schools)
