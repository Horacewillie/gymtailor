export function clampSpaces(value: string) {
  return value.replace(/\s+/g, " ").trimStart();
}
