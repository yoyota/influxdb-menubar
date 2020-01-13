const fs = require("fs")
const path = require("path")
const electronPath = require("electron")
const { Application } = require("spectron")
const Influx = require("influx")

describe("Application launch", () => {
  let app
  const url = process.env.INFLUXDB_URL || "http://localhost:8086/test"

  beforeAll(async () => {
    const influx = new Influx.InfluxDB(url)
    await influx.createDatabase("test")
    await influx.writePoints([
      {
        measurement: "cpu_load_short",
        fields: { value: 0.64 }
      }
    ])
  })

  beforeEach(async () => {
    app = new Application({
      path: electronPath,
      args: [path.join(__dirname)],
      env: { NODE_ENV: "test" }
    })
    await app.start()
    await app.client.waitUntilWindowLoaded()
  }, 1000 * 60)

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  describe("sucess case", () => {
    beforeEach(async () => {
      const query = `SELECT LAST("value") as menubar FROM "cpu_load_short"`
      const { client } = app
      await client.$("input#url").setValue(url)
      await client.$("input#query").addValue(query)
      await client.click("button[type=submit]")
    })
    test("form save button save config", async () => {
      const userDataPath = await app.electron.remote.app.getPath("userData")
      const configPath = path.join(userDataPath, "config.json")
      expect(fs.existsSync(configPath)).toBe(true)
    })

    test("get query result text", async () => {
      expect(await app.client.$("p").getText()).toContain(`menubar":0.64`)
    })

    test("menubar tray test", async () => {
      await app.client.pause(5000)
      const logs = await app.client.getMainProcessLogs()
      const expected = ["test tray title, tray title: 0.64"]
      expect(logs).toEqual(expect.arrayContaining(expected))
    })
  })
})
