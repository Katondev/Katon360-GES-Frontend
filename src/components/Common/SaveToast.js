import toastr from "toastr"
import "toastr/build/toastr.min.css"

export const SaveToast = ({ message, type, title }) => {
  toastr.options = {
    positionClass: "toast-top-right",
    timeOut: "3000",
    extendedTimeOut: "1000",
    closeButton: true,
    debug: false,
    progressBar: false,
    preventDuplicates: false,
    newestOnTop: true,
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    showDuration: "300",
    hideDuration: "1000",
  }

  switch (type) {
    case "info":
      toastr.info(message, title)
      break
    case "warning":
      toastr.warning(message, title)
      break
    case "error":
      toastr.error(message, title)
      break
    default:
      toastr.success(message, title)
  }
}
