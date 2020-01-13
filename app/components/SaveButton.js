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
      text: "Fail"
    }
  }
  return {
    variant: "success",
    text: "Saved"
  }
}

export default function({ queryResult }) {
  const [buttonProps, setButtonProps] = useState(defaultButtonProps)
  useLayoutEffect(() => {
    setButtonProps(getButtonProps(queryResult))
    const timeout = setTimeout(() => {
      setButtonProps(defaultButtonProps)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [queryResult])
  const { variant, text } = buttonProps
  return (
    <Button block type="submit" variant={variant}>
      {text}
    </Button>
  )
}
