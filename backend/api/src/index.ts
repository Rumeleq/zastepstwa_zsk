import dotenv from "dotenv"
import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import fs from "fs"
import path from "path"

import { logger } from "./logger"
import { limiter, authenticateApiKey, errorHandler } from "./middlewares"

dotenv.config({ path: path.join(__dirname, "../../.env") })

const PORT = process.env.PORT || 8080
const app = express()

process.on("unhandledRejection", (reason: any) => {
  logger.error("[Node.js] Nieobsłużone odrzucenie obietnicy", { reason })
})

process.on("uncaughtException", (error) => {
  logger.error(
    "[Node.js] Nieprzechwycony wyjątek. Aplikacja zaraz się zamknie!",
    {
      message: error.message,
      stack: error.stack,
    },
  )
  process.exit(1)
})

app.set("trust proxy", 1)
app.use(limiter)
app.use(cors())

app.get(
  "/api/replacements",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileName = process.env.REPLACEMENTS_FILENAME || "replacements.json"
      const filePath = path.join(__dirname, `../../data/${fileName}`)

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          error: "Plik z zastępstwami nie istnieje.",
        })
        return
      }

      const data = fs.readFileSync(filePath, "utf-8")
      res.json(JSON.parse(data))
    } catch (error) {
      next(error)
    }
  },
)

app.post(
  "/api/upload",
  authenticateApiKey,
  express.text({ type: "text/html", limit: "10mb" }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const htmlData = req.body
      if (!htmlData || typeof htmlData !== "string" || htmlData.trim() === "") {
        res.status(400).json({ error: "Brak treści HTML w żądaniu." })
        return
      }

      const fileName =
        process.env.VULCAN_SCHEDULE_HTML_FILENAME || "Zastępstwa.html"
      const targetDir = path.join(__dirname, "../../data/")
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }
      const filePath = path.join(targetDir, fileName)
      await fs.promises.writeFile(filePath, htmlData, { encoding: "utf8" })
      logger.info(
        `Otrzymano i zapisano nowy plik HTML zastępstw z IP: ${req.ip} (Rozmiar: ${htmlData.length} bajtów)`,
      )

      res.status(200).json({
        message:
          "Plik HTML z zastępstwami został pomyślanie przesłany i zapisany.",
      })
    } catch (error) {
      next(error)
    }
  },
)

app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Serwer nasłuchuje na porcie ${PORT}`)
})
