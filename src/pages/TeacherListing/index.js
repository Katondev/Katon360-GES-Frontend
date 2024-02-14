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

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import TableContainer from "../../components/Common/TableContainer"
import {
  SimpleStringValue,
  BoolToStatus,
} from "helpers/common_helper_functions"
import { teachers } from "common/data/teachers"
import { SaveToast } from "components/Common/SaveToast"

//i18n
import { withTranslation } from "react-i18next"
import { getAllTeacher } from "helpers/backendHelpers/teacher"

const Teachers = props => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)

  const { sc_id } = useParams()

  useEffect(() => {
    fetchAllTeachers()
  }, [])

  const fetchAllTeachers = async () => {
    try {
      setLoading(true)
      const response = await getAllTeacher(sc_id)
      let { teachers } = response.data || {}
      teachers = teachers || []
      setTeachers(teachers)
      setLoading(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Teachers"
      setTeachers([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "Staff Id",
        accessor: "tc_staffId",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Full Name",
        accessor: "tc_fullName",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Education",
        accessor: "tc_education",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Phone Number",
        accessor: "tc_phoneNumber",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Email",
        accessor: "tc_email",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Circuit",
        accessor: "tc_circuit",
        filterable: true,
        Cell: cellProps => {
          return <SimpleStringValue {...cellProps} />
        },
      },
      {
        Header: "Status",
        accessor: "tc_status",
        filterable: true,
        Cell: cellProps => {
          return cellProps.row.original.tc_status ? (
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
                to={"/teachers/view/" + cellProps.row.original.tc_id}
                className="text-dark"
              >
                <i
                  className="mdi mdi-eye font-size-18"
                  id="viewtooltipteacher"
                />
                <UncontrolledTooltip
                  placement="top"
                  target="viewtooltipteacher"
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
                data={teachers}
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

Teachers.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(Teachers)
