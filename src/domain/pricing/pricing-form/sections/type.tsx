import React from "react"
import { Controller } from "react-hook-form"
import Accordion from "../../../../components/organisms/accordion"
import RadioGroup from "../../../../components/organisms/radio-group"
import { usePriceListForm } from "../form/pricing-form-context"
import { PriceListType } from "../types"

const Type = () => {
  const { control } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      value="type"
      title="Tipo de lista"
      description="Selecciona el tipo de lista de precios que quieres crear."
      tooltip="A diferencia de los precios de venta, una modificación de precio no le comunicará al cliente que el precio es parte de una venta."
    >
      <Controller
        name="type"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => {
          return (
            <RadioGroup.Root
              value={value ?? undefined}
              onValueChange={onChange}
              className="flex items-center gap-base group-radix-state-open:mt-5 accordion-margin-transition"
            >
              <RadioGroup.Item
                value={PriceListType.SALE}
                className="flex-1"
                label="Venta"
                description="Use esto si está creando precios para una venta."
              />
              <RadioGroup.Item
                value={PriceListType.OVERRIDE}
                className="flex-1"
                label="Override"
                description="Use esto para actualizar los precios de venta existentes."
              />
            </RadioGroup.Root>
          )
        }}
      />
    </Accordion.Item>
  )
}

export default Type
