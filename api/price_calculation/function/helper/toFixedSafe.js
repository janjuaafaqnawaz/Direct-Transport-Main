export default function toFixedSafe(value, decimals) {
  if (typeof value === "number" && !isNaN(value)) {
    return value.toFixed(decimals);
  }
  return 0;
}
