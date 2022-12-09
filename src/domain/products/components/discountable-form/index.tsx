import React from "react"
import { Controller } from "react-hook-form"
import Switch from "../../../../components/atoms/switch"
import { NestedForm } from "../../../../utils/nested-form"

export type DiscountableFormType = {
  value: boolean
}

type Props = {
  form: NestedForm<DiscountableFormType>
}

const DiscountableForm = ({ form }: Props) => {
  const { control, path } = form
  return (
    <div>
      <div className="flex items-center justify-between mb-2xsmall">
        <h2 className="inter-base-semibold">Descontable</h2>
        <Controller
          control={control}
          name={path("value")}
          render={({ field: { value, onChange } }) => {
            return <Switch checked={value} onCheckedChange={onChange} />
          }}
        />
      </div>
      <p className="inter-base-regular text-grey-50">
        Cuando no se marque esta opción los descuentos no se aplicarán a este
        producto.
      </p>
    </div>
  )
}

export default DiscountableForm
