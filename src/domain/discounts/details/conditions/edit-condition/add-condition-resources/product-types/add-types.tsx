import { useAdminProductTypes } from "medusa-react"
import React, { useContext, useState } from "react"
import Button from "../../../../../../../components/fundamentals/button"
import Modal from "../../../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../../../components/molecules/modal/layered-modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  TypeRow,
  TypesHeader,
  useTypesColumns,
} from "../../../../../new/discount-form/condition-tables/shared/types"
import { useEditConditionContext } from "../../edit-condition-provider"

const AddTypesConditionsScreen = () => {
  const params = useQueryFilters(defaultQueryProps)

  const { pop } = useContext(LayeredModalContext)

  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const columns = useTypesColumns()

  const {
    isLoading: isLoadingTypes,
    count,
    product_types,
    refetch,
  } = useAdminProductTypes(params.queryObject, {
    keepPreviousData: true,
  })

  const { saveAndClose, saveAndGoBack } = useEditConditionContext()

  return (
    <>
      <Modal.Content>
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: "Buscar...",
          }}
          resourceName="Tipos"
          totalCount={count ?? 0}
          selectedIds={selectedResources}
          data={product_types || []}
          columns={columns}
          isLoading={isLoadingTypes}
          onChange={(ids) => setSelectedResources(ids)}
          renderRow={TypeRow}
          renderHeaderGroup={TypesHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex justify-end w-full space-x-xsmall">
          <Button variant="secondary" size="small" onClick={pop}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndGoBack(selectedResources, () => refetch())}
          >
            Guardar y volver
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndClose(selectedResources)}
          >
            Guardar y cerrar
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default AddTypesConditionsScreen
