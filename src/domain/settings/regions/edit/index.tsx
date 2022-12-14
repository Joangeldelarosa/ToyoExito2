import { useAdminRegion } from "medusa-react"
import React from "react"
import Spinner from "../../../../components/atoms/spinner"
import GeneralSection from "./general-section"
import ReturnShippingOptions from "./return-shipping-options"
import ShippingOptions from "./shipping-options"

type Props = {
  id?: string
}

const EditRegion = ({ id }: Props) => {
  const { region, isLoading, isError } = useAdminRegion(id!, {
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-grey-0 rounded-rounded border border-grey-20 flex flex-col gap-y-xsmall items-center justify-center w-full h-full text-center ">
        <h1 className="inter-large-semibold">Algo salió mal...</h1>
        <p className="inter-base-regular text-grey-50">
          No podemos encontrar una región con esa ID, use el menú a la izquierda
          para seleccione una región.
        </p>
      </div>
    )
  }

  if (!region) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-xsmall">
      <GeneralSection region={region} />
      <ShippingOptions region={region} />
      <ReturnShippingOptions region={region} />
    </div>
  )
}

export default EditRegion
