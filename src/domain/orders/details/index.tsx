import { Address, ClaimOrder, Fulfillment, Swap } from "@medusajs/medusa"
import { JsonViewer } from "@textea/json-viewer"
import { capitalize, sum } from "lodash"
import {
  useAdminCancelOrder,
  useAdminCapturePayment,
  useAdminOrder,
  useAdminRegion,
  useAdminUpdateOrder,
} from "medusa-react"
import moment from "moment"
import React, { useMemo, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useNavigate, useParams } from "react-router-dom"
import Avatar from "../../../components/atoms/avatar"
import CopyToClipboard from "../../../components/atoms/copy-to-clipboard"
import Spinner from "../../../components/atoms/spinner"
import Tooltip from "../../../components/atoms/tooltip"
import Badge from "../../../components/fundamentals/badge"
import Button from "../../../components/fundamentals/button"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import CancelIcon from "../../../components/fundamentals/icons/cancel-icon"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import CornerDownRightIcon from "../../../components/fundamentals/icons/corner-down-right-icon"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import MailIcon from "../../../components/fundamentals/icons/mail-icon"
import TruckIcon from "../../../components/fundamentals/icons/truck-icon"
import { ActionType } from "../../../components/molecules/actionables"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import RawJSON from "../../../components/organisms/raw-json"
import Timeline from "../../../components/organisms/timeline"
import { AddressType } from "../../../components/templates/address-form"
import { FeatureFlagContext } from "../../../context/feature-flag"
import useClipboard from "../../../hooks/use-clipboard"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { isoAlpha2Countries } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import extractCustomerName from "../../../utils/extract-customer-name"
import { formatAmountWithSymbol } from "../../../utils/prices"
import OrderEditProvider, { OrderEditContext } from "../edit/context"
import OrderEditModal from "../edit/modal"
import AddressModal from "./address-modal"
import CreateFulfillmentModal from "./create-fulfillment"
import EmailModal from "./email-modal"
import MarkShippedModal from "./mark-shipped"
import OrderLine from "./order-line"
import CreateRefundModal from "./refund"
import {
  DisplayTotal,
  FormattedAddress,
  FormattedFulfillment,
  FulfillmentStatusComponent,
  OrderStatusComponent,
  PaymentActionables,
  PaymentDetails,
  PaymentStatusComponent,
} from "./templates"

type OrderDetailFulfillment = {
  title: string
  type: string
  fulfillment: Fulfillment
  swap?: Swap
  claim?: ClaimOrder
}

const gatherAllFulfillments = (order) => {
  if (!order) {
    return []
  }

  const all: OrderDetailFulfillment[] = []

  order.fulfillments.forEach((f, index) => {
    all.push({
      title: `Envio #${index + 1}`,
      type: "default",
      fulfillment: f,
    })
  })

  if (order.claims?.length) {
    order.claims.forEach((claim) => {
      if (claim.fulfillment_status !== "not_fulfilled") {
        claim.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Reclamar envio #${index + 1}`,
            type: "claim",
            fulfillment,
            claim,
          })
        })
      }
    })
  }

  if (order.swaps?.length) {
    order.swaps.forEach((swap) => {
      if (swap.fulfillment_status !== "not_fulfilled") {
        swap.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Cambiar envio #${index + 1}`,
            type: "swap",
            fulfillment,
            swap,
          })
        })
      }
    })
  }

  return all
}

const OrderDetails = () => {
  const { id } = useParams()

  const { isFeatureEnabled } = React.useContext(FeatureFlagContext)
  const dialog = useImperativeDialog()

  const [addressModal, setAddressModal] = useState<null | {
    address: Address
    type: AddressType
  }>(null)

  const [emailModal, setEmailModal] = useState<null | {
    email: string
  }>(null)

  const [showFulfillment, setShowFulfillment] = useState(false)
  const [showRefund, setShowRefund] = useState(false)
  const [fullfilmentToShip, setFullfilmentToShip] = useState(null)

  const { order, isLoading } = useAdminOrder(id!)

  const capturePayment = useAdminCapturePayment(id!)
  const cancelOrder = useAdminCancelOrder(id!)

  const { mutate: updateOrder } = useAdminUpdateOrder(id!)

  const { region } = useAdminRegion(order?.region_id!, {
    enabled: !!order?.region_id,
  })

  const navigate = useNavigate()
  const notification = useNotification()

  const [, handleCopy] = useClipboard(`${order?.display_id!}`, {
    successDuration: 5500,
    onCopied: () => notification("Éxito", "ID del pedido copiado", "success"),
  })

  const [, handleCopyEmail] = useClipboard(order?.email!, {
    successDuration: 5500,
    onCopied: () => notification("Éxito", "Email copiado", "success"),
  })

  // @ts-ignore
  useHotkeys("esc", () => navigate("/a/orders"))
  useHotkeys("command+i", handleCopy)

  const { hasMovements, swapAmount, manualRefund, swapRefund, returnRefund } =
    useMemo(() => {
      let manualRefund = 0
      let swapRefund = 0
      let returnRefund = 0

      const swapAmount = sum(order?.swaps.map((s) => s.difference_due) || [0])

      if (order?.refunds?.length) {
        order.refunds.forEach((ref) => {
          if (ref.reason === "other" || ref.reason === "discount") {
            manualRefund += ref.amount
          }
          if (ref.reason === "return") {
            returnRefund += ref.amount
          }
          if (ref.reason === "swap") {
            swapRefund += ref.amount
          }
        })
      }
      return {
        hasMovements:
          swapAmount + manualRefund + swapRefund + returnRefund !== 0,
        swapAmount,
        manualRefund,
        swapRefund,
        returnRefund,
      }
    }, [order])

  const handleDeleteOrder = async () => {
    const shouldDelete = await dialog({
      heading: "Cancelar pedido",
      text: "¿Estás seguro de que quieres cancelar este pedido?",
    })

    if (!shouldDelete) {
      return
    }

    return cancelOrder.mutate(undefined, {
      onSuccess: () =>
        notification("Éxito", "Pedido cancelado exitosamente", "success"),
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }

  const allFulfillments = gatherAllFulfillments(order)

  const customerActionables: ActionType[] = [
    {
      label: "Ir al cliente",
      icon: <DetailsIcon size={"20"} />,
      onClick: () => navigate(`/a/customers/${order?.customer.id}`),
    },
  ]

  if (order?.shipping_address) {
    customerActionables.push({
      label: "Editar dirección de envío",
      icon: <TruckIcon size={"20"} />,
      onClick: () =>
        setAddressModal({
          address: order?.shipping_address,
          type: AddressType.SHIPPING,
        }),
    })
  }

  if (order?.billing_address) {
    customerActionables.push({
      label: "Editar dirección de facturación",
      icon: <DollarSignIcon size={"20"} />,
      onClick: () => {
        if (order.billing_address) {
          setAddressModal({
            address: order?.billing_address,
            type: AddressType.BILLING,
          })
        }
      },
    })
  }

  if (order?.email) {
    customerActionables.push({
      label: "Editar email",
      icon: <MailIcon size={"20"} />,
      onClick: () => {
        setEmailModal({
          email: order?.email,
        })
      },
    })
  }

  return (
    <div>
      <OrderEditProvider orderId={id}>
        <Breadcrumb
          currentPage={"Detalles del pedido"}
          previousBreadcrumb={"Pedidos"}
          previousRoute="/a/orders"
        />
        {isLoading || !order ? (
          <BodyCard className="w-full pt-2xlarge flex items-center justify-center">
            <Spinner size={"large"} variant={"secondary"} />
          </BodyCard>
        ) : (
          <>
            <div className="flex space-x-4">
              <div className="flex flex-col w-7/12 h-full">
                <BodyCard
                  className={"w-full mb-4 min-h-[200px]"}
                  customHeader={
                    <Tooltip side="top" content={"Copy ID"}>
                      <button
                        className="inter-xlarge-semibold text-grey-90 active:text-emerald-90 cursor-pointer gap-x-2 flex items-center"
                        onClick={handleCopy}
                      >
                        #{order.display_id} <ClipboardCopyIcon size={16} />
                      </button>
                    </Tooltip>
                  }
                  subtitle={moment(order.created_at).format(
                    "D MMMM YYYY hh:mm a"
                  )}
                  status={<OrderStatusComponent status={order.status} />}
                  forceDropdown={true}
                  actionables={[
                    {
                      label: "Cancelar pedido",
                      icon: <CancelIcon size={"20"} />,
                      variant: "danger",
                      onClick: () => handleDeleteOrder(),
                    },
                  ]}
                >
                  <div className="flex mt-6 space-x-6 divide-x">
                    <div className="flex flex-col">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        Email
                      </div>
                      <button
                        className="text-grey-90 active:text-emerald-90 cursor-pointer gap-x-1 flex items-center"
                        onClick={handleCopyEmail}
                      >
                        {order.email}
                        <ClipboardCopyIcon size={12} />
                      </button>
                    </div>
                    <div className="flex flex-col pl-6">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        Teléfono
                      </div>
                      <div>{order.shipping_address?.phone || "N/A"}</div>
                    </div>
                    <div className="flex flex-col pl-6">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        Pago
                      </div>
                      <div>
                        {order.payments
                          ?.map((p) => capitalize(p.provider_id))
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                </BodyCard>
                <OrderEditContext.Consumer>
                  {({ showModal }) => (
                    <BodyCard
                      className={"w-full mb-4 min-h-0 h-auto"}
                      title="Resumen"
                      actionables={
                        isFeatureEnabled("order_editing")
                          ? [
                              {
                                label: "Editar pedido",
                                onClick: showModal,
                              },
                            ]
                          : undefined
                      }
                    >
                      <div className="mt-6">
                        {order.items?.map((item, i) => (
                          <OrderLine
                            key={i}
                            item={item}
                            currencyCode={order.currency_code}
                          />
                        ))}
                        <DisplayTotal
                          currency={order.currency_code}
                          totalAmount={order.subtotal}
                          totalTitle={"Subtotal"}
                        />
                        {order?.discounts?.map((discount, index) => (
                          <DisplayTotal
                            key={index}
                            currency={order.currency_code}
                            totalAmount={-1 * order.discount_total}
                            totalTitle={
                              <div className="flex inter-small-regular text-grey-90 items-center">
                                Descuento:{" "}
                                <Badge className="ml-3" variant="default">
                                  {discount.code}
                                </Badge>
                              </div>
                            }
                          />
                        ))}
                        {order?.gift_cards?.map((giftCard, index) => (
                          <DisplayTotal
                            key={index}
                            currency={order.currency_code}
                            totalAmount={-1 * order.gift_card_total}
                            totalTitle={
                              <div className="flex inter-small-regular text-grey-90 items-center">
                                Gift card:{" "}
                                <Badge className="ml-3" variant="default">
                                  {giftCard.code}
                                </Badge>
                                <div className="ml-2">
                                  <CopyToClipboard
                                    value={giftCard.code}
                                    showValue={false}
                                    iconSize={16}
                                  />
                                </div>
                              </div>
                            }
                          />
                        ))}
                        <DisplayTotal
                          currency={order.currency_code}
                          totalAmount={order.shipping_total}
                          totalTitle={"Envío"}
                        />
                        <DisplayTotal
                          currency={order.currency_code}
                          totalAmount={order.tax_total}
                          totalTitle={`Impuesto`}
                        />
                        <DisplayTotal
                          variant={"large"}
                          currency={order.currency_code}
                          totalAmount={order.total}
                          totalTitle={hasMovements ? "Total Original" : "Total"}
                        />
                        <PaymentDetails
                          manualRefund={manualRefund}
                          swapAmount={swapAmount}
                          swapRefund={swapRefund}
                          returnRefund={returnRefund}
                          paidTotal={order.paid_total}
                          refundedTotal={order.refunded_total}
                          currency={order.currency_code}
                        />
                      </div>
                    </BodyCard>
                  )}
                </OrderEditContext.Consumer>

                <BodyCard
                  className={"w-full mb-4 min-h-0 h-auto"}
                  title="Pago"
                  status={
                    <PaymentStatusComponent status={order.payment_status} />
                  }
                  customActionable={
                    <PaymentActionables
                      order={order}
                      capturePayment={capturePayment}
                      showRefundMenu={() => setShowRefund(true)}
                    />
                  }
                >
                  <div className="mt-6">
                    {order.payments.map((payment) => (
                      <div className="flex flex-col" key={payment.id}>
                        <DisplayTotal
                          currency={order.currency_code}
                          totalAmount={payment.amount}
                          totalTitle={payment.id}
                          subtitle={`${moment(payment.created_at).format(
                            "DD MMM YYYY hh:mm"
                          )}`}
                        />
                        {!!payment.amount_refunded && (
                          <div className="flex justify-between mt-4">
                            <div className="flex">
                              <div className="text-grey-40 mr-2">
                                <CornerDownRightIcon />
                              </div>
                              <div className="inter-small-regular text-grey-90">
                                Reembolsado
                              </div>
                            </div>
                            <div className="flex">
                              <div className="inter-small-regular text-grey-90 mr-3">
                                -
                                {formatAmountWithSymbol({
                                  amount: payment.amount_refunded,
                                  currency: order.currency_code,
                                })}
                              </div>
                              <div className="inter-small-regular text-grey-50">
                                {order.currency_code.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between mt-4">
                      <div className="inter-small-semibold text-grey-90">
                        Total pagado
                      </div>
                      <div className="flex">
                        <div className="inter-small-semibold text-grey-90 mr-3">
                          {formatAmountWithSymbol({
                            amount: order.paid_total - order.refunded_total,
                            currency: order.currency_code,
                          })}
                        </div>
                        <div className="inter-small-regular text-grey-50">
                          {order.currency_code.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </BodyCard>
                <BodyCard
                  className={"w-full mb-4 min-h-0 h-auto"}
                  title="Envio"
                  status={
                    <FulfillmentStatusComponent
                      status={order.fulfillment_status}
                    />
                  }
                  customActionable={
                    order.fulfillment_status !== "fulfilled" &&
                    order.status !== "canceled" &&
                    order.fulfillment_status !== "shipped" && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setShowFulfillment(true)}
                      >
                        Crear envío
                      </Button>
                    )
                  }
                >
                  <div className="mt-6">
                    {order.shipping_methods.map((method) => (
                      <div className="flex flex-col" key={method.id}>
                        <span className="inter-small-regular text-grey-50">
                          Metodo de envio
                        </span>
                        <span className="inter-small-regular text-grey-90 mt-2">
                          {method?.shipping_option?.name || ""}
                        </span>
                        <div className="flex flex-col min-h-[100px] mt-8 bg-grey-5 px-3 py-2 h-full">
                          <span className="inter-base-semibold">
                            Datos{" "}
                            <span className="text-grey-50 inter-base-regular">
                              (1 producto)
                            </span>
                          </span>
                          <div className="flex flex-grow items-center mt-4">
                            <JsonViewer
                              defaultInspectDepth={0}
                              value={method?.data}
                              rootName="method"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-6 inter-small-regular ">
                      {allFulfillments.map((fulfillmentObj, i) => (
                        <FormattedFulfillment
                          key={i}
                          order={order}
                          fulfillmentObj={fulfillmentObj}
                          setFullfilmentToShip={setFullfilmentToShip}
                        />
                      ))}
                    </div>
                  </div>
                </BodyCard>
                <BodyCard
                  className={"w-full mb-4 min-h-0 h-auto"}
                  title="Cliente"
                  actionables={customerActionables}
                >
                  <div className="mt-6">
                    <div className="flex w-full space-x-4 items-center">
                      <div className="flex w-[40px] h-[40px] ">
                        <Avatar
                          user={order.customer}
                          font="inter-large-semibold"
                          color="bg-fuschia-40"
                        />
                      </div>
                      <div>
                        <h1 className="inter-large-semibold text-grey-90">
                          {extractCustomerName(order)}
                        </h1>
                        {order.shipping_address && (
                          <span className="inter-small-regular text-grey-50">
                            {order.shipping_address.city},{" "}
                            {
                              isoAlpha2Countries[
                                order.shipping_address.country_code?.toUpperCase()
                              ]
                            }
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex mt-6 space-x-6 divide-x">
                      <div className="flex flex-col">
                        <div className="inter-small-regular text-grey-50 mb-1">
                          Contacto
                        </div>
                        <div className="flex flex-col inter-small-regular">
                          <span>{order.email}</span>
                          <span>{order.shipping_address?.phone || ""}</span>
                        </div>
                      </div>
                      <FormattedAddress
                        title={"Envio"}
                        addr={order.shipping_address}
                      />
                      <FormattedAddress
                        title={"Facturacion"}
                        addr={order.billing_address}
                      />
                    </div>
                  </div>
                </BodyCard>
                <div className="mt-large">
                  <RawJSON
                    data={order}
                    title="Data del pedido"
                    rootName="order"
                  />
                </div>
              </div>
              <Timeline orderId={order.id} />
            </div>
            {addressModal && (
              <AddressModal
                handleClose={() => setAddressModal(null)}
                submit={updateOrder}
                address={addressModal.address}
                type={addressModal.type}
                allowedCountries={region?.countries}
              />
            )}
            {emailModal && (
              <EmailModal
                handleClose={() => setEmailModal(null)}
                email={emailModal.email}
                orderId={order.id}
              />
            )}
            {showFulfillment && (
              <CreateFulfillmentModal
                orderToFulfill={order as any}
                handleCancel={() => setShowFulfillment(false)}
                orderId={order.id}
              />
            )}
            {showRefund && (
              <CreateRefundModal
                order={order}
                onDismiss={() => setShowRefund(false)}
              />
            )}
            {fullfilmentToShip && (
              <MarkShippedModal
                handleCancel={() => setFullfilmentToShip(null)}
                fulfillment={fullfilmentToShip}
                orderId={order.id}
              />
            )}
            <OrderEditContext.Consumer>
              {({ isModalVisible }) =>
                isModalVisible && <OrderEditModal order={order} />
              }
            </OrderEditContext.Consumer>
          </>
        )}
      </OrderEditProvider>
    </div>
  )
}

export default OrderDetails
