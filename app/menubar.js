const Influx = require("influx")
const Store = require("electron-store")
const { menubar } = require("menubar")
const { ipcMain, Tray, nativeImage } = require("electron")
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
})

ipcMain.handle("query-test", async (_, url, query) => {
  const influx = new Influx.InfluxDB(url)
  return influx.query(query)
})

function createMenubar() {
  tray = new Tray(nativeImage.createEmpty())
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
    const { url, query } = store.get("influxdb")
    if (!url || !query) {
      return
    }
    createQueryInterval(url, query)
  })
}

exports.createMenubar = createMenubar
