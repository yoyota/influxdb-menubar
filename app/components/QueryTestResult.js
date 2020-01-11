import React from "react"

export default function({ queryResult }) {
  if (queryResult instanceof Error) {
    return <p>{queryResult.toString()}</p>
  }
  return <p>{JSON.stringify(queryResult)}</p>
}
