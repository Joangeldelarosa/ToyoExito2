import React from "react"

import StatusDot from "../../../../components/fundamentals/status-indicator"

export const PaymentStatusComponent = ({ status }) => {
  switch (status) {
    case "captured":
      return <StatusDot title="Pagado" variant="success" />
    case "awaiting":
      return <StatusDot title="Esperando" variant="default" />
    case "canceled":
      return <StatusDot title="Cancelado" variant="danger" />
    case "requires_action":
      return <StatusDot title="Requiere revision" variant="danger" />
    default:
      return null
  }
}
