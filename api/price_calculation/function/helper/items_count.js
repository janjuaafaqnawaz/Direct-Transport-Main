export default async function countItemsByType(items) {
  const count = (itemType) => {
    return items.reduce((total, item) => {
      if (item.type === itemType) {
        return total + parseInt(item.qty); // Convert qty to an integer before adding
      }
      return total;
    }, 0);
  };

  const itemTypes = [
    "Skid",
    "Pallet",
    "Box",
    "Envelope",
    "Pipes",
    "Tyres",
    "Satchel",
    "Ladder",
    "Rack",
  ];

  const result = {};

  itemTypes.forEach((type) => {
    result[type] = {
      count: count(type),
      exist: items.some((item) => item.type === type),
    };
  });

  return result;
}
