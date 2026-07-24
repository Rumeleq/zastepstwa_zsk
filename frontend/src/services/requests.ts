import axios from "axios"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export interface Replacement {
  lesson: string
  time: string
  teacherOrStatus: string
  className: string
  subject: string
  room: string
  comments: string
}

export const getReplacements = async () => {
  const res = await apiClient.get("/replacements")
  const data = res.data
  const date: string = data.date
  const replacements: Record<string, Replacement[]> = {}
  for (const [teacherName, rows] of Object.entries(data.replacements)) {
    replacements[teacherName] = (rows as string[][]).map((row) => ({
      lesson: row[0],
      time: row[1],
      teacherOrStatus: row[2],
      className: row[3],
      subject: row[4],
      room: row[5],
      comments: row[6],
    }))
  }

  return {
    date: date,
    replacements: replacements,
  }
}

export const uploadReplacementsHtml = async (htmlContent: string) => {
  const api_key = localStorage.getItem("admin_api_key")
  const res = await apiClient.post("/upload", htmlContent, {
    headers: {
      "Content-Type": "text/html",
      "x-api-key": api_key || "",
    },
  })
  return res.data
}

export const verifyApiKey = async () => {
  const api_key = localStorage.getItem("admin_api_key")
  try {
    const res = await apiClient.post(
      "/verify-api-key",
      {},
      {
        headers: {
          "x-api-key": api_key || "",
        },
      },
    )
    return res.status === 200
  } catch {
    return false
  }
}
