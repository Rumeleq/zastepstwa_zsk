import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import * as React from "react"
import { uploadReplacementsHtml } from "@services"
import { ErrorNotice, Header } from "@components"
import { useQueryClient } from "@tanstack/react-query"
import "./AdminPanelPage.scss"

export function AdminPanelPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  function handleLogout() {
    localStorage.removeItem("admin_api_key")
    navigate("/panel/logowanie")
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStatus(null)
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    processSelectedFile(selectedFile)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    setStatus(null)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      processSelectedFile(droppedFile)
    }
  }

  function processSelectedFile(selectedFile: File) {
    const name = selectedFile.name.toLowerCase()

    if (!name.endsWith(".html")) {
      setStatus({
        type: "error",
        message: "Niepoprawny format pliku! Wybierz plik HTML.",
      })
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } else {
      setFile(selectedFile)
    }
  }

  async function handleFileUpload() {
    if (!file) return
    setLoading(true)
    setStatus(null)

    try {
      const htmlContent = await file.text()
      const res = await uploadReplacementsHtml(htmlContent)
      setStatus({ type: "success", message: res.message })
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      queryClient.invalidateQueries({ queryKey: ["globalData"] })
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("admin_api_key")
        navigate("/panel/logowanie", {
          state: { error: "Klucz dostępu jest niepoprawny!" },
        })
      } else {
        const serverErrorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Wystąpił błąd podczas wysyłania pliku."

        setStatus({ type: "error", message: serverErrorMessage })
      }
    } finally {
      setLoading(false)
    }
  }

  function handleRemoveFile() {
    setFile(null)
    setStatus(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <Header></Header>
      <main className="admin-panel">
        <h2>Panel administratora Zastępstw ZSK</h2>
        <div className="upload-container">
          <h3>Wybierz plik z zastępstwami, by wgrać je do systemu</h3>

          <input
            ref={fileInputRef}
            type="file"
            accept=".html"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {!file && (
            <div
              className={`file-drop-area ${isDragging ? "dragging" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <button type="button" className="browse-btn">
                Przeglądaj
              </button>
              <span>lub przeciągnij i upuść plik .html</span>
            </div>
          )}

          {file && (
            <div className="file-details">
              <span>
                Wybrany plik: <strong>{file.name}</strong> (
                {(file.size / 1024).toFixed(2)} KB)
              </span>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="remove-btn"
              >
                Usuń plik
              </button>
            </div>
          )}

          {status && status.type === "success" && (
            <div className="alert-success">{status.message}</div>
          )}

          {status && status.type === "error" && (
            <ErrorNotice message={status.message} />
          )}

          <button
            onClick={handleFileUpload}
            disabled={!file || loading}
            className="submit-btn"
          >
            {loading ? "Wysyłanie..." : "Wyślij plan zastępstw"}
          </button>
        </div>
        <button onClick={handleLogout}>Wyloguj</button>
      </main>
    </>
  )
}
