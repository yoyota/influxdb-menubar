import React from "react"
import { Container } from "react-bootstrap"
import InfluxdbForm from "./components/InfluxdbForm"

export default function() {
  return (
    <Container>
      <div className="mb-5" />
      <InfluxdbForm />
    </Container>
  )
}
