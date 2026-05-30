import { Fragment, useEffect, useState } from "react"
import type { Replacement } from "@services"
import "./Table.scss"

export interface TableRowData extends Replacement {
  substitutingTeacher: string
}

export interface TableProps {
  data: TableRowData[]
  showSubstitutingTeacher?: boolean
  scheduleDate?: string
}

const LESSON_HOURS: Record<string, string> = {
  "0": "7:10 - 7:55",
  "1": "8:00 - 8:45",
  "2": "8:50 - 9:35",
  "3": "9:50 - 10:35",
  "4": "10:40 - 11:25",
  "5": "11:30 - 12:15",
  "6": "12:30 - 13:15",
  "7": "13:20 - 14:05",
  "8": "14:10 - 14:55",
  "9": "15:00 - 15:45",
  "10": "15:50 - 16:35",
  "11": "16:40 - 17:25",
}

function hasLessonPassed(
  lessonTimeStr: string,
  scheduleDateStr?: string,
  currentTime: Date = new Date(),
): boolean {
  if (!scheduleDateStr || scheduleDateStr === "Brak daty") return false
  if (!lessonTimeStr || lessonTimeStr === "—") return false

  const [day, month, year] = scheduleDateStr.split(".")
  if (!day || !month || !year) return false

  const parts = lessonTimeStr.split("-")
  if (parts.length !== 2) return false

  const endTimeStr = parts[1].trim()
  const [endH, endM] = endTimeStr.split(":")
  if (!endH || !endM) return false

  const lessonEndTime = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(endH, 10),
    parseInt(endM, 10),
  )

  return new Date("2026-05-30T11:03:00") > lessonEndTime
}

export function Table({
  data,
  showSubstitutingTeacher = true,
  scheduleDate,
}: TableProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [spacerHeight, setSpacerHeight] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(intervalId)
  }, [])

  const firstActiveIndex = data.findIndex(row => {
    const time = LESSON_HOURS[row.lesson] || "—"
    return !hasLessonPassed(time, scheduleDate, currentTime)
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      const activeRow = document.getElementById('active-table-row')
      if (activeRow) {
        const wrapper = activeRow.closest('.table-wrapper')
        const thead = wrapper?.querySelector('thead')
        
        if (wrapper) {
          const wrapperHeight = wrapper.clientHeight
          const maxScrollTop = wrapper.scrollHeight - wrapperHeight
          const headerHeight = thead ? thead.getBoundingClientRect().height : 80
          const offset = firstActiveIndex === -1 ? headerHeight - 1 : headerHeight
          activeRow.style.scrollMarginTop = `${offset}px`

          const rowRect = activeRow.getBoundingClientRect()
          const wrapperRect = wrapper.getBoundingClientRect()
          const absoluteY = rowRect.top - wrapperRect.top + wrapper.scrollTop
          const exactTarget = absoluteY - offset

          const spacerEl = wrapper.querySelector('.table-spacer')
          const currentSpacerHeight = spacerEl ? spacerEl.getBoundingClientRect().height : 0
          
          const newSpacerHeight = Math.max(0, Math.ceil(currentSpacerHeight + exactTarget - maxScrollTop))
          setSpacerHeight(newSpacerHeight)

          setTimeout(() => {
            activeRow.scrollIntoView({ behavior: "smooth", block: "start" })
          }, 50)
        }
      }
    }, 150)
    
    return () => clearTimeout(timeout)
  }, [firstActiveIndex, data])

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>Brak zaplanowanych zastępstw.</p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Lekcja</th>
            <th>Godzina</th>
            {showSubstitutingTeacher && <th>Nauczyciel zastępujący</th>}
            <th>Klasa</th>
            <th>Przedmiot</th>
            <th>Sala</th>
            <th>Nauczyciel nieobecny / Status</th>
            <th>Uwagi</th>
          </tr>
        </thead>
        <tbody>
          <tr className="row-separator">
            <td colSpan={showSubstitutingTeacher ? 8 : 7}></td>
          </tr>
          {data.map((row, index) => {
            const time = LESSON_HOURS[row.lesson] || "—"
            const isPassed = hasLessonPassed(time, scheduleDate, currentTime)
            const rowClass = isPassed ? "row-passed" : ""
            const isLast = index === data.length - 1
            const colSpan = showSubstitutingTeacher ? 8 : 7
            const isFirstActive = index === firstActiveIndex

            return (
              <Fragment key={index}>
                <tr
                  className={rowClass}
                  id={isFirstActive ? "active-table-row" : undefined}
                >
                  <td className="col-lesson">{row.lesson}</td>
                  <td className="col-time">{time}</td>
                  {showSubstitutingTeacher && (
                    <td className="col-sub-teacher">
                      {row.substitutingTeacher}
                    </td>
                  )}
                  <td className="col-class">{row.className}</td>
                  <td className="col-subject">{row.subject}</td>
                  <td className="col-room">{row.room || "—"}</td>
                  <td className="col-status">{row.teacherOrStatus}</td>
                  <td className="col-comments">{row.comments || "—"}</td>
                </tr>
                {!isLast && (
                  <tr className="row-separator">
                    <td colSpan={colSpan}></td>
                  </tr>
                )}
              </Fragment>
            )
          })}

          <tr
            className="table-spacer"
            id={firstActiveIndex === -1 ? "active-table-row" : undefined}
            style={{
              height: spacerHeight > 0 ? `${spacerHeight}px` : '0px',
              border: "none",
              background: "transparent",
            }}
          >
            <td
              colSpan={showSubstitutingTeacher ? 8 : 7}
              style={{ border: "none", padding: "20px", verticalAlign: "top" }}
            >{firstActiveIndex === -1 ? "Upłynęły wszystkie dzisiejsze zastępstwa. Przewiń wyżej, aby zobaczyć historię zastępstw." : ""}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
