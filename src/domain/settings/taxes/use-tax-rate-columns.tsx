import React, { useMemo } from "react"
import Badge from "../../../components/fundamentals/badge"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import Table from "../../../components/molecules/table"

const useTaxRateColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">Nombre</div>,
        accessor: "name",
        Cell: ({ row, cell: { value }, index }) => {
          return (
            <Table.Cell
              key={index}
              className="text-grey-90 group-hover:text-emerald-60 pl-2"
            >
              {row.original.type === "region" ? (
                <div className="flex gap-x-xsmall text-grey-40 items-center">
                  <LockIcon size={"12"} /> {value}
                </div>
              ) : (
                value
              )}
            </Table.Cell>
          )
        },
      },
      {
        Header: "Código",
        accessor: "code",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>
            <Badge variant="default">{value}</Badge>
          </Table.Cell>
        ),
      },
      {
        Header: "Tasa de impuesto",
        accessor: "rate",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>{value} %</Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useTaxRateColumns
