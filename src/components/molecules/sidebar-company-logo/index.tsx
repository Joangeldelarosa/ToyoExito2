import React from "react"
import logo from "../../../images/logo.png"
type SidebarCompanyLogoProps = {
  storeName?: string
}

const SidebarCompanyLogo: React.FC<SidebarCompanyLogoProps> = ({
  storeName,
}: SidebarCompanyLogoProps) => {
  return (
    <div className="flex items-center bg-grey-0 px-2.5 pb-6 w-full mb-4">
      <span className="font-semibold ml-2.5">
        <img
          src={logo}
          alt="logo"
          style={{
            maxWidth: "120px",
          }}
        />
      </span>
    </div>
  )
}

export default SidebarCompanyLogo
