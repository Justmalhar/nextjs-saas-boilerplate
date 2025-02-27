export const SHORTCUTS = {
  TOGGLE_RECORDING: ["KeyW"],
  STOP_RECORDING: ["KeyW", "Escape"],
  TOGGLE_PLAYBACK: ["Space"],
  FOCUS_SEARCH: ["Control+F", "Meta+F"],
  NEW_RECORDING: ["Control+N", "Meta+N"],
}

export function isShortcutPressed(event: KeyboardEvent, shortcut: string[]): boolean {
  const key = event.code
  const isModifierPressed = (event.ctrlKey || event.metaKey) && (key === "KeyF" || key === "KeyN")

  return (
    shortcut.some((s) => {
      if (s.includes("+")) {
        const [modifier, k] = s.split("+")
        return ((modifier === "Control" && event.ctrlKey) || (modifier === "Meta" && event.metaKey)) && k === key
      }
      return s === key
    }) || isModifierPressed
  )
}

