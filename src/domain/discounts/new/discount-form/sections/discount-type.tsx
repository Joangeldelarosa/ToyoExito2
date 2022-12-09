import clsx from "clsx"
import React from "react"
import { Controller, useWatch } from "react-hook-form"
import RadioGroup from "../../../../../components/organisms/radio-group"
import { DiscountRuleType } from "../../../types"
import { useDiscountForm } from "../form/discount-form-context"

const DiscountType = () => {
  const { control } = useDiscountForm()

  const regions = useWatch({
    control,
    name: "regions",
  })

  return (
    <Controller
      name="rule.type"
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => {
        return (
          <RadioGroup.Root
            value={value}
            onValueChange={onChange}
            className={clsx("flex items-center gap-base mt-base px-1")}
          >
            <RadioGroup.Item
              value={DiscountRuleType.PERCENTAGE}
              className="flex-1"
              label="Porcentaje"
              description={"Descuento aplicado en %"}
            />
            <RadioGroup.Item
              value={DiscountRuleType.FIXED}
              className="flex-1"
              label="Monto fijo"
              description={"Descuento en moneda"}
              disabled={Array.isArray(regions) && regions.length > 1}
              disabledTooltip="Solo puede seleccionar una región válida si desea utilizar el tipo de importe fijo"
            />
            <RadioGroup.Item
              value={DiscountRuleType.FREE_SHIPPING}
              className="flex-1"
              label="Envio gratis"
              description={"Anula el monto de la entrega"}
            />
          </RadioGroup.Root>
        )
      }}
    />
  )
}

export default DiscountType
