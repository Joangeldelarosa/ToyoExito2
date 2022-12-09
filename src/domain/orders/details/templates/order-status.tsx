import React from "react"

import StatusDot from "../../../../components/fundamentals/status-indicator"

export const OrderStatusComponent = ({ status }) => {
  switch (status) {
    case "completed":
      return <StatusDot title="Completeda" variant="success" />
    case "pending":
      return <StatusDot title="Procesando" variant="default" />
    case "canceled":
      return <StatusDot title="Canceleda" variant="danger" />
    case "requires_action":
      return <StatusDot title="Requiere revision" variant="danger" />
    default:
      return null
  }
}
