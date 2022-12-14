import { useAdminRegions } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../../../components/atoms/spinner"
import GearIcon from "../../../components/fundamentals/icons/gear-icon"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import RadioGroup from "../../../components/organisms/radio-group"
import TwoSplitPane from "../../../components/templates/two-split-pane"
import TaxDetails from "./details"

const Taxes = () => {
  const navigate = useNavigate()
  const { regions, isLoading, refetch } = useAdminRegions()
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    if (!isLoading && regions && selectedRegion === null) {
      setSelectedRegion(regions[0].id)
    }
  }, [regions, isLoading, selectedRegion])

  const handleDelete = () => {
    refetch().then(({ data }) => {
      const id = data?.regions?.[0]?.id

      if (!id) {
        return
      }

      setSelectedRegion(id)
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })
    })
  }

  const handleSelect = (id: string) => {
    refetch().then(() => {
      setSelectedRegion(id)
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      })
    })
  }

  return (
    <>
      <div>
        <BreadCrumb
          previousRoute="/a/settings"
          previousBreadcrumb="Ajustes"
          currentPage="Taxes"
        />
        <TwoSplitPane threeCols>
          <BodyCard
            forceDropdown
            title="Regiones"
            subtitle="Seleccione la región para la que desea administrar los impuestos"
            actionables={[
              {
                icon: <GearIcon />,
                label: "Ir a la configuración de la región",
                onClick: () => navigate("/a/settings/regions"),
              },
            ]}
          >
            {isLoading || !regions ? (
              <div className="flex-grow h-full flex items-center justify-center">
                <Spinner size="large" variant="secondary" />
              </div>
            ) : (
              <RadioGroup.Root
                value={selectedRegion}
                onValueChange={setSelectedRegion}
              >
                {regions.map((r) => {
                  return (
                    <RadioGroup.Item
                      label={r.name}
                      description={
                        r.countries.length
                          ? `${r.countries
                              .map((c) => c.display_name)
                              .join(", ")}`
                          : undefined
                      }
                      value={r.id}
                      key={r.id}
                      id={r.id}
                    />
                  )
                })}
              </RadioGroup.Root>
            )}
          </BodyCard>
          <TaxDetails
            id={selectedRegion}
            onDelete={handleDelete}
            handleSelect={handleSelect}
          />
        </TwoSplitPane>
      </div>
    </>
  )
}

export default Taxes
