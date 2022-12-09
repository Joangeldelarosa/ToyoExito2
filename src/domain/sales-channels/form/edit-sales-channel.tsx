import { useAdminUpdateSalesChannel } from "medusa-react"
import React, { useState } from "react"

import { SalesChannel } from "@medusajs/medusa"

import Button from "../../../components/fundamentals/button"
import InputField from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"

type EditSalesChannelProps = {
  salesChannel: SalesChannel
  handleClose: () => void
}

/**
 * Modal with sales channels edit form.
 */
function EditSalesChannel(props: EditSalesChannelProps) {
  const { handleClose, salesChannel } = props

  const notification = useNotification()

  const { mutate: updateSalesChannel, isLoading } = useAdminUpdateSalesChannel(
    salesChannel.id
  )

  const [name, setName] = useState(salesChannel.name)
  const [description, setDescription] = useState(salesChannel.description)

  const handleSubmit = () => {
    updateSalesChannel(
      { name, description },
      {
        onSuccess: () => {
          notification(
            "Éxito",
            "El canal de ventas se ha actualizado correctamente",
            "success"
          )
          handleClose()
        },
        onError: () =>
          notification(
            "Error",
            "No se pudo actualizar el canal de ventas",
            "error"
          ),
      }
    )
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            Detalles del canal de ventas
          </span>
        </Modal.Header>
        <Modal.Content>
          <div className="inter-base-semibold text-grey-90 mb-4">
            Información general
          </div>

          <div className="w-full flex flex-col gap-3">
            <InputField
              label="Nombre"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              label="Descripción"
              name="description"
              value={description!}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Cerrar
            </Button>
            <Button
              disabled={!name.length || isLoading}
              variant="primary"
              className="min-w-[100px]"
              size="small"
              onClick={handleSubmit}
              loading={isLoading}
            >
              Guardar
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditSalesChannel
