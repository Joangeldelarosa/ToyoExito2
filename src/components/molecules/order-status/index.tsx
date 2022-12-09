import React from "react"
import StatusIndicator from "../../fundamentals/status-indicator"

type PaymentStatusProps = {
  paymentStatus: string
}

type FulfillmentStatusProps = {
  fulfillmentStatus: string
}

type OrderStatusProps = {
  orderStatus: string
}

type ReturnStatusProps = {
  returnStatus: string
}

type RefundStatusProps = {
  refundStatus: string
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ paymentStatus }) => {
  switch (paymentStatus) {
    case "captured":
      return <StatusIndicator title="Pagada" variant="success" />
    case "awaiting":
      return <StatusIndicator title="En espera" variant="default" />
    case "not_paid":
      return <StatusIndicator title="Por pagar" variant="default" />
    case "canceled":
      return <StatusIndicator title="Cancelada" variant="danger" />
    case "requires_action":
      return <StatusIndicator title="Requiere revision" variant="danger" />
    default:
      return null
  }
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderStatus }) => {
  switch (orderStatus) {
    case "completed":
      return <StatusIndicator title="Completeda" variant="success" />
    case "pending":
      return <StatusIndicator title="Procesando" variant="default" />
    case "canceled":
      return <StatusIndicator title="Cancelada" variant="danger" />
    case "requires_action":
      return <StatusIndicator title="Rechazada" variant="danger" />
    default:
      return null
  }
}

const FulfillmentStatus: React.FC<FulfillmentStatusProps> = ({
  fulfillmentStatus,
}) => {
  switch (fulfillmentStatus) {
    case "shipped":
      return <StatusIndicator title="Entregada" variant="success" />
    case "fulfilled":
      return <StatusIndicator title="Enviada" variant="warning" />
    case "canceled":
      return <StatusIndicator title="Cancelada" variant="danger" />
    case "partially_fulfilled":
      return <StatusIndicator title="Procesada" variant="warning" />
    case "not_fulfilled":
      return <StatusIndicator title="Por enviar" variant="default" />
    case "requires_action":
      return <StatusIndicator title="Requiere revision" variant="danger" />
    default:
      return null
  }
}

const ReturnStatus: React.FC<ReturnStatusProps> = ({ returnStatus }) => {
  switch (returnStatus) {
    case "received":
      return <StatusIndicator title="Recibida" variant="success" />
    case "requested":
      return <StatusIndicator title="Solicitada" variant="default" />
    case "canceled":
      return <StatusIndicator title="Cancelada" variant="danger" />
    case "requires_action":
      return <StatusIndicator title="Requiere revision" variant="danger" />
    default:
      return null
  }
}

const RefundStatus: React.FC<RefundStatusProps> = ({ refundStatus }) => {
  switch (refundStatus) {
    case "na":
      return <StatusIndicator title="N/A" variant="default" />
    case "not_refunded":
      return <StatusIndicator title="Por devolver" variant="default" />
    case "refunded":
      return <StatusIndicator title="Devuelta" variant="success" />
    default:
      return null
  }
}

export {
  PaymentStatus,
  OrderStatus,
  FulfillmentStatus,
  ReturnStatus,
  RefundStatus,
}
