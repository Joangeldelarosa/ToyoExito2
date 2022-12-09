import React from "react"
import { Controller } from "react-hook-form"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import { NestedForm } from "../../../../../utils/nested-form"
import { useStoreData } from "./use-store-data"

export type RegionProvidersFormType = {
  payment_providers: Option[]
  fulfillment_providers: Option[]
}

type Props = {
  form: NestedForm<RegionProvidersFormType>
}

const RegionProvidersForm = ({ form }: Props) => {
  const {
    control,
    path,
    formState: { errors },
  } = form
  const { fulfillmentProviderOptions, paymentProviderOptions } = useStoreData()

  return (
    <div className="grid grid-cols-2 gap-large">
      <Controller
        control={control}
        name={path("payment_providers")}
        rules={{
          required: "Proveedores de pago son requeridos",
          minLength: {
            value: 1,
            message: "Proveedores de pago son requeridos",
          },
        }}
        render={({ field: { value, onBlur, onChange } }) => {
          return (
            <NextSelect
              label="Proveedores de pago"
              placeholder="Seleccionar proveedores de pago..."
              options={paymentProviderOptions}
              isMulti
              isClearable
              required
              selectAll
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              name={path("payment_providers")}
              errors={errors}
            />
          )
        }}
      />
      <Controller
        control={control}
        name={path("fulfillment_providers")}
        rules={{
          required: "Proveedores de envío son requeridos",
          minLength: {
            value: 1,
            message: "Proveedores de envío son requeridos",
          },
        }}
        render={({ field: { onBlur, onChange, value } }) => {
          return (
            <NextSelect
              label="Proveedores de envío"
              placeholder="Seleccionar proveedores de envío..."
              options={fulfillmentProviderOptions}
              required
              isMulti
              isClearable
              selectAll
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              name={path("fulfillment_providers")}
              errors={errors}
            />
          )
        }}
      />
    </div>
  )
}

export default RegionProvidersForm
