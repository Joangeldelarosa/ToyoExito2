import { PriceList } from "@medusajs/medusa"
import { isArray } from "lodash"
import React, { useMemo } from "react"
import { Column } from "react-table"
import Actionables from "../../molecules/actionables"
import Table from "../../molecules/table"
import usePriceListActions from "./use-price-list-actions"
import { formatPriceListGroups, getPriceListStatus } from "./utils"

export const usePriceListTableColumns = () => {
  const columns = useMemo<Column<PriceList>[]>(
    () => [
      {
        Header: "Nombre",
        accessor: "name",
        Cell: ({ cell: { value } }) => (
          <Table.Cell>
            <span className="inter-small-regular">{value}</span>
          </Table.Cell>
        ),
      },
      {
        Header: "Descripción",
        accessor: "description",
        Cell: ({ cell: { value } }) => <Table.Cell>{value}</Table.Cell>,
      },
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <Table.Cell>{getPriceListStatus(original)}</Table.Cell>
        ),
      },
      {
        Header: "Grupos",
        accessor: "customer_groups",
        Cell: ({ cell: { value } }) => {
          const groups: string[] = isArray(value)
            ? value.map((v) => v.name)
            : []
          const [group, other] = formatPriceListGroups(groups)
          return (
            <Table.Cell>
              {group}
              {other && <span className="text-grey-40"> + {other} mas</span>}
            </Table.Cell>
          )
        },
      },
      {
        accessor: "created_at",
        Cell: ({ row: { original: priceList } }) => {
          const { getActions } = usePriceListActions(priceList)
          return (
            <Table.Cell
              onClick={(e) => e.stopPropagation()}
              className="w-full flex justify-end"
            >
              <div className="justify-end">
                <Actionables forceDropdown actions={getActions()} />
              </div>
            </Table.Cell>
          )
        },
      },
    ],
    []
  )

  return [columns] as const
}
