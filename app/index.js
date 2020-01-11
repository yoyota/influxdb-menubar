import React, { Fragment } from "react"
import { render } from "react-dom"
import { AppContainer as ReactHotAppContainer } from "react-hot-loader"
import App from "./App"

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById("root")
)
