import moment from "moment"

export const SimpleStringValue = cell => {
  return cell.value || ""
}

export const FreePaidValue = cell => {
  return cell.value ? "Free" : "Paid" || ""
}

export const ArrayToStringValue = cell => {
  return cell.value.toString() || ""
}

export const formatDate = (date, format = "DD MMM, YYYY") => {
  date ? moment(date).format(format) : ""
}

export const stringToLowerCase = (str = "") => {
  return str.toLowerCase()
}

export const BoolToStatus=cell=>{
  return cell.value===true?"Active":"Inactive" || ""
}