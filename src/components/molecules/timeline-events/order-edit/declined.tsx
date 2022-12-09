import { useAdminCustomer } from "medusa-react"
import React from "react"
import { ByLine } from "."
import { OrderEditEvent } from "../../../../hooks/use-build-timeline"
import XCircleIcon from "../../../fundamentals/icons/x-circle-icon"
import EventContainer from "../event-container"

type EditDeclinedProps = {
  event: OrderEditEvent
}

const EditDeclined: React.FC<EditDeclinedProps> = ({ event }) => {
  const { customer } = useAdminCustomer(event.edit.declined_by as string)

  return (
    <EventContainer
      title={"Edición de pedido declinada"}
      icon={<XCircleIcon size={20} />}
      time={event.time}
      isFirst={event.first}
      midNode={<ByLine user={customer} />}
    />
  )
}

export default EditDeclined
