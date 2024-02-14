import PropTypes from "prop-types"
import React, { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  UncontrolledTooltip,
} from "reactstrap"
import TableContainer from "../../components/Common/TableContainer"

import { SimpleStringValue } from "helpers/common_helper_functions"

//i18n
import { withTranslation } from "react-i18next"
import { getAllCircuit } from "helpers/backendHelpers/area"
import { countData } from "helpers/backendHelpers/GEScount"

import { SaveToast } from "components/Common/SaveToast"
import { getUserInfo } from "helpers/authHelper"

const Dashboard = props => {
  const userInfo = getUserInfo()
  const [count, setCount] = useState({})

  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(false)
  let region = userInfo.gm_gesOffice?.go_region
  let district = userInfo.gm_gesOffice?.go_district
  let circuit = userInfo.gm_gesOffice?.go_circuit
  const RDC = `${
    region === null || region === undefined ? "REGION" : region
  } / ${
    district === null || district === undefined ? "DISTRICT" : district
  } / ${circuit === null || circuit === undefined ? "CIRCUIT" : circuit}`

  let totalSchool = 0

  areas.forEach(school => {
    let schoolCount = school.ar_schoolCount
    totalSchool += schoolCount
  })
  console.log("count12", count)
  const statastics = [
    {
      title: "Total Circuits",
      iconClass: "bx bx-map",
      description: `${areas.length === undefined ? 0 : areas.length}`,
    },
    {
      title: "Total Schools",
      iconClass: "bx bxs-school",
      description: `${count.school === undefined ? 0 : count.school}`,
    },
    {
      title: "Total Teachers",
      iconClass: "bx bxs-group",
      description: `${count.teachers === undefined ? 0 : count.teachers}`,
    },
    {
      title: "Total Non Teaching Staff",
      iconClass: "dripicons-user-group",
      description: `${
        count.nonTeachingStaff === "" ? 0 : count.nonTeachingStaff
      }`,
    },
    {
      title: "Total Students",
      iconClass: "dripicons-user-id",
      description: `${count.students === undefined ? 0 : count.students}`,
    },
  ]

  useEffect(() => {
    getAllAreas()
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      district === null ? (district = "") : district
      circuit == null ? (circuit = "") : circuit

      setLoading(true)
      const response = await countData(region, district, circuit)
      let { data } = response || {}
      data = data || []
      setCount(data)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There Was A Problem Fetching Count"
      setCount([])
      setLoading(false)

      return SaveToast({ message, type: "error" })
    }
  }
  const getAllAreas = async () => {
    try {
      district === null ? (district = "") : district
      circuit == null ? (circuit = "") : circuit
      setLoading(true)
      let response = await getAllCircuit(region, district, circuit)

      let { circuits } = response.data || {}
      console.log("circuits12", circuits)
      circuits = circuits || []
      let fillDistricts = []

      circuits.map(regionItem => {
        const { district } = regionItem
        district.map(districtItem => {
          let districtObj = {
            ar_id: districtItem.districtId,
            ar_district: districtItem.districtTitle,
            ar_region: regionItem.regionTitle,
            ar_schoolCount: districtItem.totalSchool,
          }
          fillDistricts.push(districtObj)
          // const { circuit } = districtItem
          // circuit.map(circuitItem => {
          //   let circuitObj = {
          //     ar_id: circuitItem.circuitId,
          //     ar_district: districtItem.districtTitle,
          //     ar_region: regionItem.regionTitle,
          //     ar_circuit: circuitItem.circuitTitle,
          //     ar_schoolCount: circuitItem.totalSchool,
          //   }
          //   fillDistricts.push(circuitObj)
          // })
        })
      })
      setAreas(fillDistricts)
      setLoading(false)
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "There was a problem fetching circuits"
      setAreas([])
      setLoading(false)
      return SaveToast({ message, type: "error" })
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "Region",
        accessor: "ar_region",
        filterable: true,
        Cell: cellProps => <SimpleStringValue {...cellProps} />,
      },
      {
        Header: "District",
        accessor: "ar_district",
        filterable: true,
        Cell: cellProps => <SimpleStringValue {...cellProps} />,
      },
      // {
      //   Header: "Circuit",
      //   accessor: "ar_circuit",
      //   filterable: true,
      //   Cell: cellProps => <SimpleStringValue {...cellProps} />,
      // },
      {
        Header: "School Count",
        accessor: "ar_schoolCount",
        filterable: false,
        Cell: cellProps => {
          return cellProps.row.original.ar_schoolCount === 0 ? (
            <Link to="#" className="text-dark" id="viewtooltip">
              {cellProps.row.original.ar_schoolCount}
            </Link>
          ) : (
            <Link
              to="#"
              className="text-dark"
              id="viewtooltip"
              onClick={() => {
                props.history.push(
                  `/school-listing/area/` + cellProps.row.original.ar_id
                )
              }}
            >
              <UncontrolledTooltip placement="top" target="viewtooltip">
                View
              </UncontrolledTooltip>
              {cellProps.row.original.ar_schoolCount}
            </Link>
          )
        },
      },
    ],
    []
  )
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">{RDC}</h4>
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
                    data={areas}
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
        </Container>
      </div>
    </React.Fragment>
  )
}

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(Dashboard)
