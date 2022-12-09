import React from "react"
import InputField from "../../../../components/molecules/input"
import TextArea from "../../../../components/molecules/textarea"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"

export type GeneralFormType = {
  title: string
  subtitle: string | null
  handle: string
  material: string | null
  description: string | null
}

type Props = {
  form: NestedForm<GeneralFormType>
  requireHandle?: boolean
}

const GeneralForm = ({ form, requireHandle = true }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-large mb-small">
        <InputField
          label="Titulo"
          placeholder="Winter Jacket"
          required
          {...register(path("title"), {
            required: "El titulo es requerido",
            minLength: {
              value: 1,
              message: "El titulo debe tener al menos 1 caracter",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <InputField
          label="Subtitulo"
          placeholder="Warm and cozy..."
          {...register(path("subtitle"), {
            pattern: FormValidator.whiteSpaceRule("Subtitle"),
          })}
          errors={errors}
        />
      </div>
      <p className="inter-base-regular text-grey-50 mb-large">
        Dale a tu producto un título breve y claro.
        <br />
        50-60 caracteres es la longitud recomendada para los motores de
        búsqueda.
      </p>
      <div className="grid grid-cols-2 gap-x-large mb-large">
        <InputField
          label="Identificador"
          tooltipContent={
            !requireHandle
              ? "El identificador es la parte de la URL que identifica el producto. Si no se especifica, se generará a partir del título."
              : undefined
          }
          placeholder="winter-jacket"
          required={requireHandle}
          {...register(path("handle"), {
            required: requireHandle
              ? "El identificador es requerido"
              : undefined,
            minLength: FormValidator.minOneCharRule("Handle"),
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
          prefix="/"
          errors={errors}
        />
        <InputField
          label="Material"
          placeholder="100% cotton"
          {...register(path("material"), {
            minLength: FormValidator.minOneCharRule("Material"),
            pattern: FormValidator.whiteSpaceRule("Material"),
          })}
          errors={errors}
        />
      </div>
      <TextArea
        label="Descripción"
        placeholder="A warm and cozy jacket..."
        rows={3}
        className="mb-small"
        {...register(path("description"))}
        errors={errors}
      />
      <p className="inter-base-regular text-grey-50">
        Dé a su producto una descripción breve y clara.
        <br />
        120-160 caracteres es la longitud recomendada para los motores de
        búsqueda.
      </p>
    </div>
  )
}

export default GeneralForm
