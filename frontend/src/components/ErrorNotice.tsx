export function ErrorNotice({ message }: { message: string }) {
  return (
    <div role="alert">
      <span style={{ color: "#ff4d4f", marginTop: "8px" }}>{message}</span>
    </div>
  )
}
