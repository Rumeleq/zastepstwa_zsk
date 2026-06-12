import * as cheerio from "cheerio"
import fs from "fs"
import path from "path"
import { logger } from "./logger"

export async function processAndSaveReplacements(htmlData: string) {
  const targetDir = path.join(__dirname, "../../data/")

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  const htmlFileName =
    process.env.VULCAN_SCHEDULE_HTML_FILENAME || "Zastępstwa.html"
  const htmlFilePath = path.join(targetDir, htmlFileName)
  await fs.promises.writeFile(htmlFilePath, htmlData, { encoding: "utf8" })

  const $ = cheerio.load(htmlData)

  let scheduleDate = "Brak daty"
  const dateHeader = $("h2").first().text().trim()
  if (dateHeader) {
    scheduleDate = dateHeader.split(" ")[1] || "Brak daty"
  }

  const replacements: Record<string, string[][]> = {}
  const rows = $("tr").toArray()

  for (let i = 2; i < rows.length; i++) {
    const columns = $(rows[i]).find("td").toArray()
    if (columns.length < 6) continue

    const lessonInfo = columns.map((col) =>
      $(col).text().replaceAll("|", " | ").trim(),
    )

    // Kopiujemy nauczyciela zastępującego, usuwając go jednocześnie z informacji o lekcji
    const teacher = lessonInfo.splice(5, 1)[0]
    const lesson = lessonInfo[0]
    if (lesson) {
      const lessonNumberAndHour = lesson.split(", ")
      lessonInfo[0] = lessonNumberAndHour[0] || ""
      lessonInfo.splice(1, 0, lessonNumberAndHour[1] || "")
    }

    if (!teacher) continue
    if (!replacements[teacher]) {
      replacements[teacher] = []
    }
    replacements[teacher].push(lessonInfo)
  }

  const dataToExport = {
    date: scheduleDate,
    replacements: replacements,
  }

  const jsonFileName = process.env.REPLACEMENTS_FILENAME || "replacements.json"
  const jsonFilePath = path.join(targetDir, jsonFileName)

  await fs.promises.writeFile(
    jsonFilePath,
    JSON.stringify(dataToExport, null, 4),
    "utf-8",
  )

  logger.info(`Pomyślnie sparsowano zastępstwa i zapisano do ${jsonFileName}`)
}
