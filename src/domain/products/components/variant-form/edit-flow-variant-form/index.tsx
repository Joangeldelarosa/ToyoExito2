import React from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import InputField from "../../../../../components/molecules/input"
import Accordion from "../../../../../components/organisms/accordion"
import { nestedForm } from "../../../../../utils/nested-form"
import CustomsForm, { CustomsFormType } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"
import { PricesFormType } from "../../prices-form"
import VariantGeneralForm, {
  VariantGeneralFormType,
} from "../variant-general-form"
import VariantPricesForm from "../variant-prices-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"

export type EditFlowVariantFormType = {
  /**
   * Used to identify the variant during product create flow. Will not be submitted to the backend.
   */
  _internal_id?: string
  general: VariantGeneralFormType
  prices: PricesFormType
  stock: VariantStockFormType
  options: {
    title: string
    value: string
    id: string
  }[]
  customs: CustomsFormType
  dimensions: DimensionsFormType
}

type Props = {
  form: UseFormReturn<EditFlowVariantFormType, any>
}

/**
 * Re-usable Product Variant form used to add and edit product variants.
 * @example
 * const MyForm = () => {
 *   const form = useForm<VariantFormType>()
 *   const { handleSubmit } = form
 *
 *   const onSubmit = handleSubmit((data) => {
 *     // do something with data
 *   })
 *
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <VariantForm form={form} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )
 * }
 */
const EditFlowVariantForm = ({ form }: Props) => {
  const { fields } = useFieldArray({
    control: form.control,
    name: "options",
  })

  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="General" value="general" required>
        <div>
          <VariantGeneralForm form={nestedForm(form, "general")} />
          <div className="mt-xlarge">
            <div className="flex items-center gap-x-2xsmall mb-base">
              <h3 className="inter-base-semibold">Opciones</h3>
              <IconTooltip
                type="info"
                content="Las opciones se utilizan para definir el color, el tamaño, etc. de la variante."
              />
            </div>
            <div className="grid grid-cols-2 gap-large pb-2xsmall">
              {fields.map((field, index) => {
                return (
                  <InputField
                    required
                    key={field.id}
                    label={field.title}
                    {...form.register(`options.${index}.value`, {
                      required: `El valor de opcion para ${field.title} es requerido`,
                    })}
                    errors={form.formState.errors}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Precios" value="pricing">
        <VariantPricesForm form={nestedForm(form, "prices")} />
      </Accordion.Item>
      <Accordion.Item title="Stock & Inventory" value="stock">
        <VariantStockForm form={nestedForm(form, "stock")} />
      </Accordion.Item>
      <Accordion.Item title="Shipping" value="shipping">
        <p className="inter-base-regular text-grey-50">
          La información de envío puede ser requerida dependiendo de su envío
          proveedor y si realiza o no envíos internacionales.
        </p>
        <div className="mt-large">
          <h3 className="inter-base-semibold mb-2xsmall">Dimensions</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Configure para calcular las tarifas de envío más precisas.
          </p>
          <DimensionsForm form={nestedForm(form, "dimensions")} />
        </div>
        <div className="mt-xlarge">
          <h3 className="inter-base-semibold mb-2xsmall">Personalizados</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Configure si está realizando envíos internacionales.
          </p>
          <CustomsForm form={nestedForm(form, "customs")} />
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default EditFlowVariantForm
