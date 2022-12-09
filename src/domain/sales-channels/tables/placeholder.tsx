import React from "react"

import Button from "../../../components/fundamentals/button"
import SidedMouthFaceIcon from "../../../components/fundamentals/icons/sided-mouth-face"

function Placeholder({ showAddModal }) {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <span className="text-grey-50">
        <SidedMouthFaceIcon width="48" height="48" />
      </span>

      <h3 className="font-semibold text-large text-gray-90 mt-6">
        Comience a crear la configuración de sus canales...
      </h3>
      <p className="mt-2 mb-8 text-grey-50 w-[358px] text-center">
        Todavía no ha agregado ningún producto a estos canales, pero una vez que
        lo haga estarán aquí.
      </p>

      <Button onClick={showAddModal} variant="primary" size="small">
        Agregar productos
      </Button>
    </div>
  )
}

export default Placeholder
