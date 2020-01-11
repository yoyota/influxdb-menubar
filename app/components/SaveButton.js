import React, { useState, useLayoutEffect } from "react"
import { Button } from "react-bootstrap"

const defaultButtonProps = {
  variant: "primary",
  text: "Save & Test"
}

function getButtonProps(queryResult) {
  if (queryResult === undefined) {
    return defaultButtonProps
  }
  if (queryResult instanceof Error) {
    return {
      variant: "danger",
      text: "fail"
    }
  }
  return {
    variant: "success",
    text: "saved"
  }
}

export default function({ queryResult }) {
  const [buttonProps, setButtonProps] = useState(defaultButtonProps)
  useLayoutEffect(() => {
    setButtonProps(getButtonProps(queryResult))
    setTimeout(() => {
      setButtonProps(defaultButtonProps)
    }, 3000)
  }, [queryResult])
  const { variant, text } = buttonProps
  return (
    <Button block type="submit" variant={variant}>
      {text}
    </Button>
  )
}
