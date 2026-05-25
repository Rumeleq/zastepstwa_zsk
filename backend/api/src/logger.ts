import fs from "fs"
import path from "path"
import winston from "winston"

const logsDirectory = path.join(__dirname, "../../logs")

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true })
}

const customTextFormat = winston.format.printf(
  ({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`
  },
)

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customTextFormat,
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDirectory, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logsDirectory, "app.log"),
    }),
  ],
})

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console())
}
