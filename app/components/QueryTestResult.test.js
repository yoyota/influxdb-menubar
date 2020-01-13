import React from "react"
import { render } from "@testing-library/react"
import QueryTestResult from "./QueryTestResult"

test("renders error result", () => {
  const queryResult = new Error("test error")
  const { getByText } = render(<QueryTestResult queryResult={queryResult} />)
  const errorText = getByText(/test error/i)
  expect(errorText).toBeInTheDocument()
})

test("renders success result", () => {
  const queryResult = [
    {
      result: 0.00012,
      time: "2020-01-13T02:12:40.633Z"
    }
  ]
  const { getByText } = render(<QueryTestResult queryResult={queryResult} />)
  const errorText = getByText(/2020-01-13T02:12:40.633Z/i)
  expect(errorText).toBeInTheDocument()
})
