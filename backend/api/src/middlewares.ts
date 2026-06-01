import crypto from "crypto"
import { Request, Response, NextFunction } from "express"
import rateLimit from "express-rate-limit"
import { logger } from "./logger"

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: {
    error: "Zbyt wiele zapytań z tego adresu IP. Spróbuj ponownie za 5 minut.",
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export function authenticateApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const providedApiKey = req.headers["x-api-key"]
  const expectedApiKey = process.env.API_KEY

  if (!expectedApiKey) {
    logger.error("Brakuje API_KEY w .env serwera")
    res.status(500).json({ error: "Wewnętrzny błąd serwera." })
    return
  }

  if (!providedApiKey || typeof providedApiKey !== "string") {
    logger.warn(
      `Brak klucza autoryzacyjnego. Ścieżka: ${req.originalUrl}`,
    )
    res
      .status(401)
      .json({ error: "Brak klucza autoryzacyjnego lub nieprawidłowy format." })
    return
  }

  const providedHash = crypto
    .createHash("sha256")
    .update(providedApiKey)
    .digest()
  const expectedHash = crypto
    .createHash("sha256")
    .update(expectedApiKey)
    .digest()

  if (!crypto.timingSafeEqual(providedHash, expectedHash)) {
    logger.warn(
      `Nieudana próba dostępu. Ścieżka: ${req.originalUrl}`,
    )
    res.status(401).json({ error: "Nieprawidłowy klucz autoryzacyjny." })
    return
  }

  next()
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(
    `[Express] Wystąpił błąd podczas żądania do ${req.originalUrl}`,
    {
      message: err.message,
      stack: err.stack,
    },
  )

  res.status(500).json({ error: "Wewnętrzny błąd serwera." })
}
