import { AdminPostTaxRatesTaxRateReq, TaxRate } from "@medusajs/medusa"
import { useAdminUpdateRegion, useAdminUpdateTaxRate } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Modal from "../../../components/molecules/modal"
import { ILayeredModalContext } from "../../../components/molecules/modal/layered-modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import {
  EditTaxRateDetails,
  EditTaxRateFormType,
} from "./edit-tax-rate-details"
import { TaxRuleItem } from "./tax-rule-item"
import TaxRuleSelector from "./tax-rule-selector"

type EditTaxRateProps = {
  taxRate: TaxRate
  regionId: string
  modalContext: ILayeredModalContext
  onDismiss: () => void
}

export interface EditTaxRateFormData extends SimpleEditFormData {
  products: string[]
  product_types: string[]
  shipping_options: string[]
}

const EditTaxRate = ({
  modalContext,
  regionId,
  taxRate,
  onDismiss,
}: EditTaxRateProps) => {
  const { mutate, isLoading } = useAdminUpdateTaxRate(taxRate.id)

  const [updatedRules, setUpdatedRules] = useState({})
  const form = useForm<EditTaxRateFormData>({
    defaultValues: {
      details: {
        name: taxRate.name,
        code: taxRate.code || undefined,
        rate: taxRate.rate || undefined,
      },
      products: taxRate.products.map((p) => p.id),
      product_types: taxRate.product_types.map((p) => p.id),
      shipping_options: taxRate.shipping_options.map((p) => p.id),
    },
  })
  const { register, setValue, handleSubmit, watch } = form
  const notification = useNotification()

  const onSave = handleSubmit((data) => {
    const toSubmit: AdminPostTaxRatesTaxRateReq = {
      name: data.details.name,
      code: data.details.code,
      rate: data.details.rate,
      product_types: data.product_types,
      products: data.products,
      shipping_options: data.shipping_options,
    }
    const conditionalFields = ["products", "product_types", "shipping_options"]

    for (const [key, value] of Object.entries(updatedRules)) {
      if (!value && key in toSubmit && conditionalFields.includes(key)) {
        delete toSubmit[key]
      }
    }

    mutate(toSubmit, {
      onSuccess: () => {
        notification(
          "Éxito",
          "Tasa de impuestos actualizada con éxito.",
          "success"
        )
        onDismiss()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  })

  useEffect(() => {
    register("products")
    register("product_types")
    register("shipping_options")
  }, [])

  const [products, product_types, shipping_options] = watch([
    "products",
    "product_types",
    "shipping_options",
  ])

  const handleOverridesSelected = (rule) => {
    setUpdatedRules((prev) => {
      prev[rule.type] = true
      return prev
    })
    switch (rule.type) {
      case "products":
        setValue("products", rule.items)
        break
      case "product_types":
        setValue("product_types", rule.items)
        break
      case "shipping_options":
        setValue("shipping_options", rule.items)
        break
      default:
        break
    }
  }

  return (
    <form onSubmit={onSave}>
      <Modal.Content>
        <div className="mb-xlarge">
          <EditTaxRateDetails form={nestedForm(form, "details")} />
        </div>
        <div>
          <p className="inter-base-semibold mb-base">Actualizaciones</p>
          {(product_types.length > 0 ||
            products.length > 0 ||
            shipping_options.length > 0) && (
            <div className="flex flex-col gap-base">
              {products.length > 0 && (
                <TaxRuleItem
                  onDelete={() =>
                    handleOverridesSelected({ type: "products", items: [] })
                  }
                  onEdit={() => {
                    modalContext.push(
                      SelectOverridesScreen(
                        modalContext.pop,
                        regionId,
                        handleOverridesSelected,
                        {
                          items: products,
                          type: "products",
                        }
                      )
                    )
                  }}
                  index={1}
                  name="Reglas de producto"
                  description={`Aplica a ${products.length} producto${
                    products.length > 1 ? "s" : ""
                  }`}
                />
              )}
              {product_types.length > 0 && (
                <TaxRuleItem
                  onDelete={() =>
                    handleOverridesSelected({
                      type: "product_types",
                      items: [],
                    })
                  }
                  onEdit={() => {
                    modalContext.push(
                      SelectOverridesScreen(
                        modalContext.pop,
                        regionId,
                        handleOverridesSelected,
                        {
                          items: product_types,
                          type: "product_types",
                        }
                      )
                    )
                  }}
                  index={2}
                  name="Reglas de tipos de producto"
                  description={`Aplica a ${product_types.length} tipo${
                    product_types.length > 1 ? "s" : ""
                  } de producto`}
                />
              )}
              {shipping_options.length > 0 && (
                <TaxRuleItem
                  onDelete={() =>
                    handleOverridesSelected({
                      type: "shipping_options",
                      items: [],
                    })
                  }
                  onEdit={() => {
                    modalContext.push(
                      SelectOverridesScreen(
                        modalContext.pop,
                        regionId,
                        handleOverridesSelected,
                        {
                          items: shipping_options,
                          type: "shipping_options",
                        }
                      )
                    )
                  }}
                  index={3}
                  name="Reglas de opción de envío"
                  description={`Aplica a ${shipping_options.length} opcion${
                    shipping_options.length > 1 ? "es" : ""
                  } de envio`}
                />
              )}
            </div>
          )}
          {!(
            product_types.length &&
            products.length &&
            shipping_options.length
          ) && (
            <Button
              type="button"
              onClick={() => {
                modalContext.push(
                  SelectOverridesScreen(
                    modalContext.pop,
                    regionId,
                    handleOverridesSelected
                  )
                )
              }}
              className="w-full mt-base"
              size="medium"
              variant="secondary"
            >
              <PlusIcon /> Agregar actualización
            </Button>
          )}
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex items-center justify-end w-full">
          <Button
            type="button"
            onClick={onDismiss}
            variant="ghost"
            size="small"
            className="w-eventButton justify-center"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="small"
            className="w-eventButton justify-center"
            loading={isLoading}
            disabled={isLoading}
          >
            Guardar
          </Button>
        </div>
      </Modal.Footer>
    </form>
  )
}

const SelectOverridesScreen = (
  pop,
  regionId,
  onOverridesSelected,
  options = {}
) => {
  return {
    title: "Agregar actualización",
    onBack: () => pop(),
    view: (
      <TaxRuleSelector
        regionId={regionId}
        onSubmit={onOverridesSelected}
        {...options}
      />
    ),
  }
}

type SimpleEditFormProps = {
  onDismiss: () => void
  taxRate: TaxRate
}

export interface SimpleEditFormData {
  details: EditTaxRateFormType
}

export const SimpleEditForm = ({ onDismiss, taxRate }: SimpleEditFormProps) => {
  const { mutate, isLoading } = useAdminUpdateRegion(taxRate.id)

  const form = useForm<SimpleEditFormData>({
    defaultValues: {
      details: {
        name: taxRate.name,
        rate: taxRate.rate || undefined,
        code: taxRate.code || undefined,
      },
    },
  })
  const { handleSubmit } = form
  const notification = useNotification()

  const onSave = (data: SimpleEditFormData) => {
    const toSubmit = {
      tax_rate: data.details.rate,
      tax_code: data.details.code,
    }
    mutate(toSubmit, {
      onSuccess: () => {
        notification(
          "Éxito",
          "Tasa predeterminada actualizada con éxito",
          "success"
        )
        onDismiss()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Modal.Content>
        <EditTaxRateDetails form={nestedForm(form, "details")} lockName />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex items-center justify-end w-full">
          <Button
            type="button"
            onClick={onDismiss}
            variant="ghost"
            size="small"
            className="w-eventButton justify-center"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="small"
            className="w-eventButton justify-center"
            loading={isLoading}
          >
            Guardar
          </Button>
        </div>
      </Modal.Footer>
    </form>
  )
}

export default EditTaxRate
