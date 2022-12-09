import React from "react"
import RadioGroup from "../../../../../../components/organisms/radio-group"
import { DiscountConditionOperator } from "../../../../types"

type ConditionOperatorProps = {
  value: "in" | "not_in"
  onChange: (value: DiscountConditionOperator) => void
}

const ConditionOperator: React.FC<ConditionOperatorProps> = ({
  value,
  onChange,
}) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      className="grid grid-cols-2 gap-base mb-4"
    >
      <RadioGroup.Item
        className="w-full"
        label="En"
        value={DiscountConditionOperator.IN}
        description="Aplica para los seleccionados."
      />
      <RadioGroup.Item
        className="w-full"
        label="Excluyendo a"
        value={DiscountConditionOperator.NOT_IN}
        description="Aplica para todos excepto los seleccionados."
      />
    </RadioGroup.Root>
  )
}

export default ConditionOperator
