import { BatchJob } from "@medusajs/medusa/dist"

export enum BatchJobOperation {
  Import = "Import",
  Export = "Export",
}

export function batchJobDescriptionBuilder(
  batchJob: BatchJob,
  operation: BatchJobOperation,
  elapsedTime?: number
): string {
  let description = ""

  const entityName = batchJob.type.split("-").reverse().pop()

  const twentyfourHoursInMs = 24 * 60 * 60 * 1000

  switch (batchJob.status) {
    case "failed":
      description = `${operation} de ${entityName}s ha fallido.`
      break
    case "canceled":
      description = `${operation} de ${entityName}s ha sido cancelada.`
    case "completed":
      if (elapsedTime && Math.abs(elapsedTime) > twentyfourHoursInMs) {
        description = `${operation} El archivo ya no está disponible. El archivo solo se almacenará durante 24 horas.`
        break
      } else {
        description = `${operation} de ${entityName}s esta listo.`
        break
      }
    case "processing":
      description = `${operation} de ${entityName}s está siendo procesado. Puede cerrar con seguridad la pestaña de actividad. Le notificaremos una vez que su exportación esté lista para descargar.`
      break
    case "confirmed":
      description = `${operation} de ${entityName}s ha sido confirmado y comenzará pronto.`
      break
    case "pre_processed":
      description = `${operation} de ${entityName}s está siendo procesado.`
      break
    default:
      description = `${operation} de ${entityName}s ha sido creado y comenzará pronto.`
  }

  return description
}
