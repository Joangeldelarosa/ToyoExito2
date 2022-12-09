import React from "react"

import StatusDot from "../../../../components/fundamentals/status-indicator"

export const FulfillmentStatusComponent = ({ status }) => {
  switch (status) {
    case "shipped":
      return <StatusDot title="Entregado" variant="success" />
    case "fulfilled":
      return <StatusDot title="Enviado" variant="warning" />
    case "canceled":
      return <StatusDot title="Cancelado" variant="danger" />
    case "partially_fulfilled":
      return <StatusDot title="Envioo parcial" variant="warning" />
    case "requires_action":
      return <StatusDot title="Requiere revision" variant="danger" />
    default:
      return null
  }
}
