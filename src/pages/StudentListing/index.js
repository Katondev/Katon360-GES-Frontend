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
  Badge,
} from "reactstrap"

import TableContainer from "../../components/Common/TableContainer"
import {
  SimpleStringValue,
  BoolToStatus,
} from "helpers/common_helper_functions"
import { students } from "common/data/students"
import { SaveToast } from "components/Common/SaveToast"

//i18n
import { withTranslation } from "react-i18next"
import { getAllStudent } from "helpers/backendHelpers/student"

const Students = props => {
  const [students, setStudents] = useState([])
  const [student, setStudent] = useState({})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const { sc_id } = useParams()

  useEffect(() => {
    fetchAllStudents()
  }, [])

  const fetchAllStudents = async () => {
    try {
      setLoading(true)
      const response = await getAllStudent(sc_id)
      let { students } = response.data || {}
      students = students || []
      setStudents(students)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Students"
      setStudents([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "st_fullName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Phone Number",
        accessor: "st_phoneNumber",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Email",
        accessor: "st_email",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Circuit",
        accessor: "st_circuit",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "st_status",
        filterable: true,
        Cell: cellProps => {
          return cellProps.row.original.st_status ? (
            <Badge
              pill
              color="soft-success"
              className="badge-soft-success me-1"
            >
              Active
            </Badge>
          ) : (
            <Badge pill color="soft-danger" className="badge-soft-danger me-1">
              InActive
            </Badge>
          )
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
                to={"/students/view/" + cellProps.row.original.st_id}
                className="text-dark"
              >
                <i
                  className="mdi mdi-eye font-size-18"
                  id="viewtooltipstudent"
                />
                <UncontrolledTooltip
                  placement="top"
                  target="viewtooltipstudent"
                >
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
    <React.Fragment>
      <Row className="mt-3">
        <Col xs="12">
          <Card>
            <CardBody>
              <TableContainer
                columns={columns}
                data={students}
                isGlobalFilter={true}
                isAddOptions={false}
                customPageSize={10}
                className="custom-header-css"
                canExportCsv={true}
                canPrint={false}
                dataFetchLoading={loading}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default withTranslation()(Students)
