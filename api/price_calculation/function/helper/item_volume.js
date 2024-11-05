export default async function calculateItemsVolume(items) {
  let total_weight = 0;
  let cubic_capacity = 0;

  items.forEach((item) => {
    const quantity = parseInt(item.qty, 10);
    total_weight += parseInt(item.weight, 10) * quantity;
    cubic_capacity +=
      ((item.length * item.width * item.height) / 4000) * quantity;
  });

  const max_volume = Math.max(total_weight, cubic_capacity);
  const longest_length = Math.max(...items.map((item) => item.length));
  const longest_height = Math.max(...items.map((item) => item.height));
  const longest_width = Math.max(...items.map((item) => item.width));

  const total_length = items.reduce((acc, item) => {
    return acc + parseInt(item.length) * parseInt(item.qty || 1);
  }, 0);

  let palletSpaces = Math.ceil(cubic_capacity);

  return {
    total_weight,
    cubic_capacity,
    max_volume,
    longest_length,
    longest_height,
    longest_width,
    total_length,
    palletSpaces,
  };
}
