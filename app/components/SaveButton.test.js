import React from "react"
import { render, waitForDomChange } from "@testing-library/react"
import SaveButton from "./SaveButton"

jest.useFakeTimers()

const successQueryResult = [
  {
    result: 0.00012,
    time: "2020-01-13T02:12:40.633Z"
  }
]

const failQueryResult = new Error("test error")

test("default", () => {
  const { getByText } = render(<SaveButton />)
  const buttonText = getByText(/Save & Test/i)
  expect(buttonText).toBeInTheDocument()
})

test("success", () => {
  const { getByText } = render(<SaveButton queryResult={successQueryResult} />)
  const button = getByText(/Saved/i)
  expect(button).toBeInTheDocument()
})

test("success state change after timeout", async () => {
  const { container, getByText } = render(
    <SaveButton queryResult={successQueryResult} />
  )
  const promise = waitForDomChange(container)
  jest.runAllTimers()
  await promise
  const button = getByText(/Save & Test/i)
  expect(button).toBeInTheDocument()
})

test("fail", () => {
  const { getByText } = render(<SaveButton queryResult={failQueryResult} />)
  const buttonText = getByText(/Fail/i)
  expect(buttonText).toBeInTheDocument()
})

test("fail state change after timeout", async () => {
  const { container, getByText } = render(
    <SaveButton queryResult={failQueryResult} />
  )
  const promise = waitForDomChange(container)
  jest.runAllTimers()
  await promise
  const button = getByText(/Save & Test/i)
  expect(button).toBeInTheDocument()
})
