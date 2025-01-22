import * as React from "react"

import { Dropdown } from "."
import { Story, UseCase } from "../../../.storybook/views"

export default {
  title: "DropDown",
  component: Dropdown,
}

const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
]

export const DropDownSelect = () => {
  const [opt, setOpt] = React.useState("1")

  return (
    <Story>
      <UseCase text="Select Basic">
        <Dropdown
          data={data}
          value={opt}
          onChange={(x) => {
            setOpt(x)
          }}
        />
      </UseCase>
    </Story>
  )
}