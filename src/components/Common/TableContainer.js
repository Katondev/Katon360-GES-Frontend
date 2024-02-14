import React, { Fragment } from "react"
import PropTypes from "prop-types"
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table"
import { Table, Row, Col, Button, Input, Label, Spinner } from "reactstrap"
import { Filter, DefaultColumnFilter } from "./filters"
import { CSVLink } from "react-csv"

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <Col sm={4}>
      <div className="search-box me-2 d-inline-block">
        <div className="position-relative">
          <label htmlFor="search-bar-0" className="search-label">
            <span id="search-bar-0-label" className="sr-only">
              Search this table
            </span>
            <input
              onChange={e => {
                setValue(e.target.value)
                onChange(e.target.value)
              }}
              id="search-bar-0"
              type="text"
              className="form-control form-control-sm"
              placeholder={`${count} records...`}
              value={value || ""}
            />
          </label>
          <i className="bx bx-search-alt search-icon"></i>
        </div>
      </div>
    </Col>
  )
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  className,
  customPageSizeOptions,
  canExportCsv,
  canPrint,
  dataFetchLoading,
  noDataMessage,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          {
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  )

  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
  }

  const onChangeInSelect = event => {
    setPageSize(Number(event.target.value))
  }

  const onChangeInInput = event => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0
    gotoPage(page)
  }
  return (
    <Fragment>
      <Row className="mb-2">
        <Col md={customPageSizeOptions ? 2 : 1}>
          <select
            className="form-select form-select-sm"
            value={pageSize}
            onChange={onChangeInSelect}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Col>
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
        {isAddOptions && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn mb-2 me-2"
                size="sm"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New Order
              </Button>
            </div>
          </Col>
        )}
        {canExportCsv && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="dark"
                className="btn ml-2 me-2 mb-2"
                disabled={!rows.length}
                size="sm"
              >
                <CSVLink
                  data={rows.map(row => row.original)}
                  className="csv-export-button"
                >
                  <i className="mdi mdi-export-variant me-1" />
                  Export CSV
                </CSVLink>
              </Button>
            </div>
          </Col>
        )}
        {isAddUserList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="dark"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                color="dark"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id}>
                    <div className="mb-2" {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    <Filter column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row)
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr>
                    {row.cells.map(cell => {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      )
                    })}
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </Table>
      </div>

      {dataFetchLoading ? (
        <>
          <div className="text-center">
            <Spinner color="dark" type="grow" />
          </div>
        </>
      ) : (
        <>
          {page?.length === 0 && (
            <>
              <div className="text-center">
                <Label tag="h5">{noDataMessage || "No Data Available"}</Label>
              </div>
            </>
          )}
        </>
      )}

      <Row className="justify-content-md-end justify-content-center align-items-center">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              color="dark"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </Button>
            <Button
              color="dark"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            style={{ width: 70 }}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={onChangeInInput}
          />
        </Col>

        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button color="dark" onClick={nextPage} disabled={!canNextPage}>
              {">"}
            </Button>
            <Button
              color="dark"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default TableContainer

// import React, { Fragment, useEffect, useRef, useState } from "react"
// import PropTypes from "prop-types"
// import {
//   useTable,
//   useGlobalFilter,
//   useAsyncDebounce,
//   useSortBy,
//   useFilters,
//   useExpanded,
//   usePagination,
// } from "react-table"
// import { Table, Row, Col, Button, Input } from "reactstrap"
// import { Filter, DefaultColumnFilter } from "./filters"
// import { CSVLink } from "react-csv"
// import ReactToPrint from "react-to-print"

// import PrintDataTable from "./PrintDataTable"

// // Define a default UI for filtering
// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length
//   const [value, setValue] = React.useState(globalFilter)
//   const onChange = useAsyncDebounce(value => {
//     setGlobalFilter(value || undefined)
//   }, 200)

//   return (
//     <Col sm={4}>
//       <div className="search-box me-2 mb-2 d-inline-block">
//         <div className="position-relative">
//           <label htmlFor="search-bar-0" className="search-label">
//             <span id="search-bar-0-label" className="sr-only">
//               Search this table
//             </span>
//             <input
//               onChange={e => {
//                 setValue(e.target.value)
//                 onChange(e.target.value)
//               }}
//               id="search-bar-0"
//               type="text"
//               className="form-control"
//               placeholder={`${count} records...`}
//               value={value || ""}
//             />
//           </label>
//           <i className="bx bx-search-alt search-icon"></i>
//         </div>
//       </div>
//     </Col>
//   )
// }

// const TableContainer = ({
//   columns,
//   data,
//   isGlobalFilter,
//   isAddOptions,
//   addButtonLabel,
//   isAddUserList,
//   handleOrderClicks,
//   handleAddButtonClick,
//   handleUserClick,
//   handleCustomerClick,
//   isAddCustList,
//   customPageSize,
//   className,
//   customPageSizeOptions,
//   canExportCsv,
//   canPrint,
//   printColumns,
// }) => {
//   const ref = useRef(null)
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     page,
//     rows,
//     prepareRow,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,
//     state,
//     preGlobalFilteredRows,
//     setGlobalFilter,
//     state: { pageIndex, pageSize },
//   } = useTable(
//     {
//       columns,
//       data,
//       defaultColumn: { Filter: DefaultColumnFilter },
//       initialState: {
//         pageIndex: 0,
//         pageSize: customPageSize,
//         sortBy: [
//           {
//             desc: true,
//           },
//         ],
//         hiddenColumns: [],
//       },
//     },
//     useGlobalFilter,
//     useFilters,
//     useSortBy,
//     useExpanded,
//     usePagination
//   )

//   const [printData, setPrintData] = useState([])

//   useEffect(() => {
//     setPrintData(rows.map(row => row.original))
//   }, [rows])

//   const generateSortingIndicator = column => {
//     return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
//   }

//   const onChangeInSelect = event => {
//     setPageSize(Number(event.target.value))
//   }

//   const onChangeInInput = event => {
//     const page = event.target.value ? Number(event.target.value) - 1 : 0
//     gotoPage(page)
//   }
//   return (
//     <Fragment>
//       <Row className="mb-2">
//         <Col md={customPageSizeOptions ? 2 : 1}>
//           <select
//             className="form-select"
//             value={pageSize}
//             onChange={onChangeInSelect}
//           >
//             {[10, 20, 30, 40, 50].map(pageSize => (
//               <option key={pageSize} value={pageSize}>
//                 Show {pageSize}
//               </option>
//             ))}
//           </select>
//         </Col>
//         {isGlobalFilter && (
//           <GlobalFilter
//             preGlobalFilteredRows={preGlobalFilteredRows}
//             globalFilter={state.globalFilter}
//             setGlobalFilter={setGlobalFilter}
//           />
//         )}
//         {isAddOptions && (
//           <Col sm="7">
//             <div className="text-sm-end">
//               <Button
//                 type="button"
//                 color="success"
//                 className="btn mb-2 me-2"
//                 onClick={handleAddButtonClick}
//               >
//                 {addButtonLabel && (
//                   <>
//                     <i className="mdi mdi-plus me-1" />
//                     {addButtonLabel}
//                   </>
//                 )}
//               </Button>
//               {canExportCsv && (
//                 <>
//                   <Button
//                     type="button"
//                     color="dark"
//                     className="btn ml-2 me-2 mb-2"
//                     disabled={!rows.length}
//                   >
//                     <CSVLink
//                       data={rows.map(row => row.original)}
//                       className="csv-export-button"
//                     >
//                       <i className="mdi mdi-export-variant me-1" />
//                       Export CSV
//                     </CSVLink>
//                   </Button>
//                 </>
//               )}
//               {canPrint && (
//                 <>
//                   <ReactToPrint
//                     trigger={() => (
//                       <Button
//                         type="button"
//                         color="warning"
//                         className="btn ml-2 mb-2 me-2"
//                       >
//                         <i className="mdi mdi-printer me-1" />
//                         Print
//                       </Button>
//                     )}
//                     content={() => ref.current}
//                   />
//                   {printColumns?.length && (
//                     <div hidden>
//                       <PrintDataTable
//                         printColumns={printColumns}
//                         printData={printData}
//                         ref={ref}
//                       />
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </Col>
//         )}
//         {isAddUserList && (
//           <Col sm="7">
//             <div className="text-sm-end">
//               <Button
//                 type="button"
//                 color="dark"
//                 className="btn mb-2 me-2"
//                 onClick={handleUserClick}
//               >
//                 <i className="mdi mdi-plus-circle-outline me-1" />
//                 Create New User
//               </Button>
//             </div>
//           </Col>
//         )}
//         {isAddCustList && (
//           <Col sm="7">
//             <div className="text-sm-end">
//               <Button
//                 type="button"
//                 color="success"
//                 className="btn-rounded mb-2 me-2"
//                 onClick={handleCustomerClick}
//               >
//                 <i className="mdi mdi-plus me-1" />
//                 New Customers
//               </Button>
//             </div>
//           </Col>
//         )}
//       </Row>

//       <div className="table-responsive react-table">
//         <Table bordered hover {...getTableProps()} className={className}>
//           <thead className="table-light table-nowrap">
//             {headerGroups.map(headerGroup => (
//               <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
//                 {headerGroup.headers.map(column => (
//                   <th key={column.id}>
//                     <div className="mb-2" {...column.getSortByToggleProps()}>
//                       {column.render("Header")}
//                       {generateSortingIndicator(column)}
//                     </div>
//                     <Filter column={column} />
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>

//           <tbody {...getTableBodyProps()}>
//             {page.map(row => {
//               prepareRow(row)
//               return (
//                 <Fragment key={row.getRowProps().key}>
//                   <tr>
//                     {row.cells.map(cell => {
//                       return (
//                         <td key={cell.id} {...cell.getCellProps()}>
//                           {cell.render("Cell")}
//                         </td>
//                       )
//                     })}
//                   </tr>
//                 </Fragment>
//               )
//             })}
//           </tbody>
//         </Table>
//       </div>

//       <Row className="justify-content-md-end justify-content-center align-items-center">
//         <Col className="col-md-auto">
//           Total: <strong>{preGlobalFilteredRows.length}</strong>
//         </Col>
//         <Col className="col-md-auto">
//           <div className="d-flex gap-1">
//             <Button
//               color="primary"
//               onClick={() => gotoPage(0)}
//               disabled={!canPreviousPage}
//             >
//               {"<<"}
//             </Button>
//             <Button
//               color="primary"
//               onClick={previousPage}
//               disabled={!canPreviousPage}
//             >
//               {"<"}
//             </Button>
//           </div>
//         </Col>
//         <Col className="col-md-auto d-none d-md-block">
//           Page{" "}
//           <strong>
//             {pageIndex + 1} of {pageOptions.length}
//           </strong>
//         </Col>
//         <Col className="col-md-auto">
//           <Input
//             type="number"
//             min={1}
//             style={{ width: 70 }}
//             max={pageOptions.length}
//             value={pageIndex + 1}
//             onChange={onChangeInInput}
//           />
//         </Col>

//         <Col className="col-md-auto">
//           <div className="d-flex gap-1">
//             <Button color="primary" onClick={nextPage} disabled={!canNextPage}>
//               {">"}
//             </Button>
//             <Button
//               color="primary"
//               onClick={() => gotoPage(pageCount - 1)}
//               disabled={!canNextPage}
//             >
//               {">>"}
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Fragment>
//   )
// }

// TableContainer.propTypes = {
//   preGlobalFilteredRows: PropTypes.any,
// }

// export default TableContainer
