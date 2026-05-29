import axios from "axios"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

interface Replacement {
  lesson: string
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
  const replacements: Record<string, Array<Replacement>> = {}
  for (const [teacherName, rows] of Object.entries(data.replacements)) {
    replacements[teacherName] = (rows as string[][]).map((row) => ({
      lesson: row[0],
      teacherOrStatus: row[1],
      className: row[2],
      subject: row[3],
      room: row[4],
      comments: row[5],
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
    const res = await apiClient.post("/verify-api-key", {}, {
      headers: {
        "x-api-key": api_key || "",
      }
    })
    return res.status === 200
  } catch (error) {
    return false
  }
}
