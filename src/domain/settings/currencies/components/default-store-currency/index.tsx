import { Store } from "@medusajs/medusa"
import React from "react"
import DefaultCurrencySelector from "./default-currency-selector"

type Props = {
  store: Store
}

const DefaultStoreCurrency = ({ store }: Props) => {
  return (
    <div className="flex flex-col gap-y-large">
      <div>
        <h3 className="inter-large-semibold mb-2xsmall">
          Moneda por defecto de la tienda
        </h3>
        <p className="inter-base-regular text-grey-50">
          Esta es la moneda en la que se mostrarán los precios de los productos
        </p>
      </div>

      <DefaultCurrencySelector store={store} />
    </div>
  )
}

export default DefaultStoreCurrency
