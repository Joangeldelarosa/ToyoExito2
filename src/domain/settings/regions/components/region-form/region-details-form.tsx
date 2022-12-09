import React from "react"
import { Controller } from "react-hook-form"
import Switch from "../../../../../components/atoms/switch"
import FeatureToggle from "../../../../../components/fundamentals/feature-toggle"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"
import { useStoreData } from "./use-store-data"

export type RegionDetailsFormType = {
  name: string
  countries: Option[]
  currency_code: Option
  tax_rate: number | null
  tax_code: string | null
  includes_tax?: boolean
}

type Props = {
  isCreate?: boolean
  form: NestedForm<RegionDetailsFormType>
}

const RegionDetailsForm = ({ form, isCreate = false }: Props) => {
  const {
    control,
    register,
    path,
    formState: { errors },
  } = form
  const { currencyOptions, countryOptions } = useStoreData()

  return (
    <div>
      <div className="grid grid-cols-2 gap-large">
        <InputField
          label="Titulo"
          placeholder="Europe"
          required
          {...register(path("name"), {
            required: "Se requiere título",
            minLength: FormValidator.minOneCharRule("Title"),
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <Controller
          control={control}
          name={path("currency_code")}
          rules={{
            required: "Codigo de moneda es requerido",
          }}
          render={({ field }) => {
            return (
              <NextSelect
                label="Moneda"
                placeholder="Seleccionar moneda"
                required
                {...field}
                options={currencyOptions}
                name={path("currency_code")}
                errors={errors}
              />
            )
          }}
        />
        {isCreate && (
          <>
            <InputField
              label="Tasa de impuesto"
              required
              placeholder="25"
              prefix="%"
              step={0.01}
              type={"number"}
              {...register(path("tax_rate"), {
                required: isCreate ? "Tax rate is required" : undefined,
                max: {
                  value: 100,
                  message: "La tasa de impuesto no puede ser mayor a 100",
                },
                min: FormValidator.nonNegativeNumberRule("Tax rate"),
                valueAsNumber: true,
              })}
              errors={errors}
            />
            <InputField
              label="Codigo de impuesto"
              placeholder="1000"
              {...register(path("tax_code"))}
              errors={errors}
            />
          </>
        )}
        <Controller
          control={control}
          name={path("countries")}
          render={({ field }) => {
            return (
              <NextSelect
                label="Paises"
                placeholder="Seleccionar paises"
                isMulti
                selectAll
                {...field}
                name={path("countries")}
                errors={errors}
                options={countryOptions}
              />
            )
          }}
        />
      </div>
      <FeatureToggle featureFlag="tax_inclusive_pricing">
        <div className="flex items-start justify-between mt-xlarge">
          <div className="flex flex-col gap-y-2xsmall">
            <h3 className="inter-base-semibold">Tax incluidas en precios</h3>
            <p className="inter-base-regular text-grey-50">
              Cuando está habilitado, los precios de la región incluirán
              impuestos.
            </p>
          </div>
          <Controller
            control={control}
            name={path("includes_tax")}
            render={({ field: { value, onChange } }) => {
              return <Switch checked={value} onCheckedChange={onChange} />
            }}
          />
        </div>
      </FeatureToggle>
    </div>
  )
}

export default RegionDetailsForm
