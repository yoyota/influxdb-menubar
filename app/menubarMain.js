const Influx = require("influx")
const Store = require("electron-store")
const { menubar } = require("menubar")
const { ipcMain, nativeImage, Tray } = require("electron")
const { to } = require("await-to-js")

const { NODE_ENV } = process.env

let tray
let intervalID

async function createQueryInterval(url, query) {
  clearInterval(intervalID)
  const influx = new Influx.InfluxDB(url)
  intervalID = setInterval(async () => {
    const [err, result] = await to(influx.query(query))
    if (err) {
      tray.setTitle("error")
      tray.setToolTip(err.toString())
      clearInterval(intervalID)
    }
    if (!result || result.length === 0 || !result[0] || !result[0].menubar) {
      return
    }
    tray.setTitle(result[0].menubar.toString())
  }, 1000)
}

ipcMain.on("create-query-interval", async (_, url, query) => {
  createQueryInterval(url, query)

  if (NODE_ENV === "test") {
    setTimeout(() => {
      console.log(`test tray title, tray title: ${tray.getTitle()}`)
    }, 2500)
  }
})

ipcMain.handle("query-test", async (_, url, query) => {
  const influx = new Influx.InfluxDB(url)
  return influx.query(query)
})

function createMenubar() {
  const pencilDataURL =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAhFBMVEUAAADs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PHs8PFed9IBAAAAK3RSTlMAAQMEBQYLIScqLC0vMjU2ODk+QkN+f4KGi46SlZeanbe5wMHDyNni8/f9aI/hMAAAAH5JREFUGBmdwUkCgjAQBMCORkTcjUFxBaOi0///n3OKgSNVGGbzytHnSCnQZUqqAin3sCXJLxI7qYL15BV/W9k3DNbfDaK1uIbk0xpES3E11c0gWoirqS4G0VxcTXU2iGafd6A6ISHTrCVZIcV8nLU8ooNcjcIBXVQePROFgX5ezA2dwHGGSQAAAABJRU5ErkJggg=="
  tray = new Tray(nativeImage.createFromDataURL(pencilDataURL))
  const mb = menubar({
    browserWindow: {
      show: false,
      width: NODE_ENV === "development" ? 1024 : 512,
      height: 256,
      webPreferences: {
        nodeIntegration: true
      }
    },
    env: { NODE_ENV: "test" },
    index: `file://${__dirname}/app.html`,
    tray
  })

  mb.on("ready", () => {
    if (NODE_ENV === "test") {
      mb.showWindow()
    }
    const store = new Store()
    const { url, query } = store.get("influxdb") || {}
    if (!url || !query) {
      return
    }
    createQueryInterval(url, query)
  })
}

exports.createMenubar = createMenubar
