import Swal from "sweetalert2";

const baseConfig = {
  background: "#0d0d0d",
  color: "#fff",
  confirmButtonColor: "#2563eb",
  cancelButtonColor: "#374151",
};

export const showSuccess = (text, title = "Listo") =>
  Swal.fire({
    ...baseConfig,
    icon: "success",
    title,
    text,
  });

export const showError = (text, title = "Error") =>
  Swal.fire({
    ...baseConfig,
    icon: "error",
    title,
    text,
  });

export const showWarning = (text, title = "Atención") =>
  Swal.fire({
    ...baseConfig,
    icon: "warning",
    title,
    text,
  });

export const confirmAction = async (text, title = "Confirmar") => {
  const result = await Swal.fire({
    ...baseConfig,
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });

  return result.isConfirmed;
};
