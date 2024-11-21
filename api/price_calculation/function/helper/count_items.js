"use client"
export default function CountItems(items, itemType) {
  return items.reduce((total, item) => {
    if (item.type === itemType) {
      return total + parseInt(item.qty, 10); // Convert qty to integer with radix 10
    }
    return total;
  }, 0);
}
