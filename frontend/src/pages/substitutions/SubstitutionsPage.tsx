import "./SubstitutionsPage.scss"
import { useGlobalData } from "@hooks"
import { useState } from "react"
import {
  AllSubstitutions,
  TeacherSelection,
  TeacherSubstitutions,
} from "@pages/substitutions/views"
import { Header } from "@components"

const View = {
  All: "all",
  TeacherSelection: "teacherSelection",
  TeacherSubstitutions: "teacherSubstitutions",
} as const

type ViewType = (typeof View)[keyof typeof View]

export function SubstitutionsPage() {
  const { data, isLoading, isError, error } = useGlobalData()
  const [currentView, setCurrentView] = useState<ViewType | null>(View.All)
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)

  const handleTeacherSelection = (name: string) => {
    setSelectedTeacher(name)
    setCurrentView(View.TeacherSubstitutions)
  }

  function renderView() {
    if (isLoading) return <p>Pobieranie danych...</p>
    if (isError) return <p className="error">Błąd: {error?.message}</p>
    if (!data) return null

    switch (currentView) {
      case View.All:
        return (
          <AllSubstitutions
            onSwitch={() => {
              if (selectedTeacher) {
                setCurrentView(View.TeacherSubstitutions)
              } else {
                setCurrentView(View.TeacherSelection)
              }
            }}
          />
        )
      case View.TeacherSelection:
        return (
          <TeacherSelection
            onSwitch={() => setCurrentView(View.All)}
            onSelectTeacher={handleTeacherSelection}
          />
        )
      case View.TeacherSubstitutions:
        return (
          <TeacherSubstitutions
            onSwitch={() => setCurrentView(View.All)}
            onChangeTeacher={() => {
              setSelectedTeacher(null)
              setCurrentView(View.TeacherSelection)
            }}
            teacherName={selectedTeacher!}
          />
        )
    }
  }

  return (
    <>
      <Header />
      {renderView()}
    </>
  )
}
