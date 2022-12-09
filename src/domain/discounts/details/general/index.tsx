import { Discount } from "@medusajs/medusa"
import { useAdminDeleteDiscount, useAdminUpdateDiscount } from "medusa-react"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Badge from "../../../../components/fundamentals/badge"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../components/molecules/actionables"
import StatusSelector from "../../../../components/molecules/status-selector"
import BodyCard from "../../../../components/organisms/body-card"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import EditGeneral from "./edit-general"

type GeneralProps = {
  discount: Discount
}

const General: React.FC<GeneralProps> = ({ discount }) => {
  const dialog = useImperativeDialog()
  const navigate = useNavigate()
  const notification = useNotification()
  const updateDiscount = useAdminUpdateDiscount(discount.id)
  const deletediscount = useAdminDeleteDiscount(discount.id)
  const [showmModal, setShowModal] = useState(false)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Promotion",
      text: "Are you sure you want to delete this promotion?",
    })
    if (shouldDelete) {
      deletediscount.mutate(undefined, {
        onSuccess: () => {
          notification("Éxito", "Promción eliminada con éxito", "success")
          navigate("/a/discounts/")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      })
    }
  }

  const onStatusChange = async () => {
    updateDiscount.mutate(
      {
        is_disabled: !discount.is_disabled,
      },
      {
        onSuccess: () => {
          const pastTense = !discount.is_disabled ? "publicado" : "ocultado"
          notification(
            "Éxito",
            `Descuento ${pastTense} exitosamente`,
            "success"
          )
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  }

  const actionables: ActionType[] = [
    {
      label: "Editar información general",
      onClick: () => setShowModal(true),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Eliminar descuento",
      onClick: onDelete,
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]

  return (
    <>
      <BodyCard
        actionables={actionables}
        title={discount.code}
        subtitle={discount.rule.description}
        forceDropdown
        className="min-h-[200px]"
        status={
          <div className="flex items-center gap-x-2xsmall">
            {discount.is_dynamic && (
              <span>
                <Badge variant="default">
                  <span className="text-grey-90 inter-small-regular">
                    {"Template discount"}
                  </span>
                </Badge>
              </span>
            )}
            <StatusSelector
              isDraft={discount?.is_disabled}
              activeState="Published"
              draftState="Draft"
              onChange={onStatusChange}
            />
          </div>
        }
      >
        <div className="flex">
          <div className="border-l border-grey-20 pl-6">
            {getPromotionDescription(discount)}
            <span className="inter-small-regular text-grey-50">
              Cantidad de descuento
            </span>
          </div>
          <div className="border-l border-grey-20 pl-6 ml-12">
            <h2 className="inter-xlarge-regular text-grey-90">
              {discount.regions.length.toLocaleString("en-US")}
            </h2>
            <span className="inter-small-regular text-grey-50">
              Regiones aplicables
            </span>
          </div>
          <div className="border-l border-grey-20 pl-6 ml-12">
            <h2 className="inter-xlarge-regular text-grey-90">
              {discount.usage_count.toLocaleString("en-US")}
            </h2>
            <span className="inter-small-regular text-grey-50">
              Total de usos
            </span>
          </div>
        </div>
      </BodyCard>
      {showmModal && (
        <EditGeneral discount={discount} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}

const getPromotionDescription = (discount: Discount) => {
  switch (discount.rule.type) {
    case "fixed":
      return (
        <div className="flex items-baseline">
          <h2 className="inter-xlarge-regular">
            {formatAmountWithSymbol({
              currency: discount.regions[0].currency_code,
              amount: discount.rule.value,
            })}
          </h2>
          <span className="inter-base-regular text-grey-50 ml-1">
            {discount.regions[0].currency_code.toUpperCase()}
          </span>
        </div>
      )
    case "percentage":
      return (
        <div className="flex items-baseline">
          <h2 className="inter-xlarge-regular text-grey-90">
            {discount.rule.value}
          </h2>
          <span className="inter-base-regular text-grey-50 ml-1">%</span>
        </div>
      )
    case "free_shipping":
      return (
        <h2 className="inter-xlarge-regular text-grey-90">{`ENVIO GRATIS`}</h2>
      )
    default:
      return "Descuento desconocido"
  }
}

export default General
