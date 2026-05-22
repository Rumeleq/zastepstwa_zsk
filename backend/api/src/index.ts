import express, { Request, Response } from "express"
import cors from "cors"
import fs from "fs"
import path from "path"
import morgan from "morgan"

const app = express()
const PORT = 8080

const logsDirectory = path.join(__dirname, "../../logs")

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true })
}

const accessLogStream = fs.createWriteStream(
  path.join(logsDirectory, "api.log"),
  { flags: "a" },
)

app.use(morgan("combined", { stream: accessLogStream }))
app.use(morgan("dev"))

app.use(cors())

app.get("/api/replacements", (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, "../../data/replacements.json")

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        error: "Plik z zastępstwami nie istnieje.",
      })
      return
    }

    const data = fs.readFileSync(filePath, "utf-8")
    res.json(JSON.parse(data))
  } catch (error) {
    console.error("Błąd podczas serwowania jsona z zastępstwami: ", error)
    res.status(500).json({ error: "Wewnętrzny błąd serwera." })
  }
})

app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`)
})
