import React from "react"
import PageDescription from "../atoms/page-description"

const SettingsOverview: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <PageDescription
        title={"Ajustes"}
        subtitle={"Gestiona la configuración de tu tienda."}
      />
      <div className="grid medium:grid-cols-2 auto-cols-fr grid-cols-1 gap-x-base gap-y-xsmall">
        {children}
      </div>
    </div>
  )
}

export default SettingsOverview
