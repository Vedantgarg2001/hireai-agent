export default function Toast({ message, type = "info" }) {
  const icons = { info: "ℹ️", success: "✅", warn: "⚠️", error: "❌" };
  return (
    <div className={`toast ${type}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
