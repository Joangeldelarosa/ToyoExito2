import { useAdminSendResetPasswordToken } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import SigninInput from "../../molecules/input-signin"

type ResetTokenCardProps = {
  goBack: () => void
}

type FormValues = {
  email: string
}

const checkMail = /^\S+@\S+$/i

const ResetTokenCard: React.FC<ResetTokenCardProps> = ({ goBack }) => {
  const [unrecognizedEmail, setUnrecognizedEmail] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [mailSent, setSentMail] = useState(false)
  const { register, handleSubmit } = useForm<FormValues>()

  const sendEmail = useAdminSendResetPasswordToken()

  const onSubmit = (values: FormValues) => {
    if (!checkMail.test(values.email)) {
      setInvalidEmail(true)
      return
    }

    setInvalidEmail(false)
    setUnrecognizedEmail(false)

    sendEmail.mutate(
      {
        email: values.email,
      },
      {
        onSuccess: () => {
          setSentMail(true)
        },
        onError: () => {
          setUnrecognizedEmail(true)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center">
        <span className="inter-2xlarge-semibold mt-base text-grey-90">
          Restablecer password
        </span>
        <span className="inter-base-regular text-grey-50 mt-xsmall text-center">
          Ingrese su dirección de correo electrónico a continuación y le
          enviaremos
          <br />
          instrucciones sobre cómo restablecer su contraseña.
        </span>
        {!mailSent ? (
          <>
            <SigninInput
              placeholder="lebron@james.com..."
              {...register("email", { required: true })}
              className="mb-0 mt-xlarge"
            />
            {unrecognizedEmail && (
              <div className="mt-xsmall w-[318px]">
                <span className="inter-small-regular text-rose-50 text-left">
                  No podemos encontrar un usuario con esa dirección de correo
                  electrónico.
                </span>
              </div>
            )}
            {invalidEmail && (
              <div className="mt-xsmall w-[318px]">
                <span className="inter-small-regular text-rose-50 text-left">
                  La dirección de email no es válida
                </span>
              </div>
            )}
            <button
              className="text-grey-0 w-[320px] h-[48px] border rounded-rounded mt-4 bg-emerald-50 inter-base-regular py-3 px-4"
              type="submit"
            >
              Enviar instrucciones de reinicio
            </button>
          </>
        ) : (
          <div className="text-emerald-60 rounded-rounded bg-emerald-10 p-base flex gap-x-small mt-large">
            <div>
              <CheckCircleIcon size={20} />
            </div>
            <div className="flex flex-col gap-y-2xsmall">
              <span className="inter-small-semibold">
                Le enviamos un correo electrónico con éxito{" "}
              </span>
              <span className="inter-small-regular">
                Le hemos enviado un correo electrónico que puede utilizar para
                restablecer su clave. Revisa tu carpeta de spam si no lo has
                recibido despues de unos minutos.
              </span>
            </div>
          </div>
        )}
        <span
          className="inter-small-regular text-grey-50 mt-8 cursor-pointer"
          onClick={goBack}
        >
          Volver para iniciar sesión
        </span>
      </div>
    </form>
  )
}

export default ResetTokenCard
