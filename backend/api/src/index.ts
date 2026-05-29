import dotenv from "dotenv"
import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import fs from "fs"
import path from "path"
import { processAndSaveReplacements } from "./parser"

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
app.use(cors())
app.use(limiter)

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" })
})

app.post(
  "/api/verify-api-key",
  authenticateApiKey,
  (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" })
  },
)

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

      logger.info(
        `Otrzymano nowy HTML zastępstw z IP: ${req.ip} (Rozmiar: ${htmlData.length} bajtów). Przetwarzanie...`,
      )

      await processAndSaveReplacements(htmlData)

      logger.info(
        `Zastępstwa z IP: ${req.ip} (Rozmiar: ${htmlData.length} bajtów) zostały pomyślnie przetworzone i zapisane.`,
      )

      res.status(200).json({
        message:
          "Plik HTML z zastępstwami został pomyślanie przesłany i sparsowany.",
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
