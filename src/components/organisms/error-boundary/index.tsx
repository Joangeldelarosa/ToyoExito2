import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import React, { ErrorInfo } from "react"
import { analytics, getAnalyticsConfig } from "../../../services/analytics"
import Button from "../../fundamentals/button"

type State = {
  hasError: boolean
  status?: number
  message?: string
}

type Props = {
  children?: React.ReactNode
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(error: Error) {
    const state: State = {
      hasError: true,
      status: undefined,
      message: error.message,
    }

    if (isNetworkError(error)) {
      state.status = error.response?.status
    }

    return state
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const shouldTrack = await shouldTrackEvent(error)

    if (!shouldTrack) {
      return
    }

    const properties = getTrackingInfo(error, errorInfo)
    analytics.track("error", properties)
  }

  public dismissError = () => {
    history.back()
    this.setState({ hasError: false })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center px-large">
          <div className="max-w-[600px]">
            <div>
              <div>
                {this.state.status && (
                  <p className="text-grey-60 opacity-75 inter-small-semibold">
                    {this.state.status}
                  </p>
                )}
                <h1 className="inter-xlarge-semibold mb-xsmall">
                  {errorMessage(this.state.status)}
                </h1>
                <p className="inter-base-regular text-grey-50">
                  {errorDescription(this.state.status)}
                </p>
              </div>

              <div className="w-full flex items-center  mt-xlarge">
                <Button
                  size="small"
                  variant="primary"
                  onClick={this.dismissError}
                >
                  Volver al dashboard
                </Button>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      )
    }

    return this.props.children
  }
}

const isNetworkError = (error: Error): error is AxiosError => {
  return error["response"] !== undefined && error["response"] !== null
}

const shouldTrackEvent = async (error: Error) => {
  // Don't track 404s
  if (isNetworkError(error) && error.response?.status === 404) {
    return false
  }

  const res = await getAnalyticsConfig().catch(() => undefined)

  // Don't track if we have no config to ensure we have permission
  if (!res) {
    return false
  }

  // Don't track if user has opted out from sharing usage insights
  if (res.analytics_config.opt_out) {
    return false
  }

  return true
}

const errorMessage = (status?: number) => {
  const defaultMessage = "Un error ha ocurrido"

  if (!status) {
    return defaultMessage
  }

  const message = {
    400: "La solicitud es incorrecta",
    401: "No estás logueado",
    403: "No tienes permiso para realizar esta acción",
    404: "Pagina no encontrada",
    500: "El servidor no pudo procesar tu solicitud",
    503: "El servidor no está disponible",
  }[status]

  return message || defaultMessage
}

const errorDescription = (status?: number) => {
  const defaultDescription =
    "Ocurrió un error con causas no especificadas, lo más probable es que se deba a un problema técnico de nuestra parte. Intente actualizar la página. Si el problema persiste, comuníquese con su administrador."

  if (!status) {
    return defaultDescription
  }

  const description = {
    400: "La solicitud tiene un formato incorrecto, solucione su solicitud y vuelva a intentarlo.",
    401: "No ha iniciado sesión, inicie sesión para continuar.",
    403: "No tiene permiso para realizar esta acción, si cree que se trata de un error, póngase en contacto con su administrador.",
    404: "No se encontró la página solicitada, verifique la URL y vuelva a intentarlo.",
    500: "El servidor no pudo manejar su solicitud, lo más probable es que se deba a un problema técnico de nuestra parte. Inténtalo de nuevo. Si el problema persiste, comuníquese con su administrador.",
    503: "El servidor no está disponible temporalmente y no se pudo procesar su solicitud. Por favor, inténtelo de nuevo más tarde. Si el problema persiste, comuníquese con su administrador.",
  }[status]

  return description || defaultDescription
}

const getTrackingInfo = (error: Error, errorInfo: ErrorInfo) => {
  return {
    error: error.message,
    componentStack: errorInfo.componentStack,
  }
}

export default ErrorBoundary
