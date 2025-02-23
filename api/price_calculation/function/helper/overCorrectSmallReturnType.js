export default function overCorrectSmallReturnType(
  longest_height,
  longest_width,
  longest_length
) {
  return function (type) {
    if (["Courier", "C", "HT", "1T"].includes(type) && longest_height > 200) {
      console.log("Longest height exceeds 2, changing job to '2T'");
      return "2T";
    } else if (
      ["Courier", "C", "HT"].includes(type) &&
      longest_width > 100 &&
      longest_length > 100
    ) {
      console.log("Longest width or length exceeds 1, changing job to '1T'");
      return "1T";
    } else {
      console.log("Longest width, length and height didn't exceed limits");
      return type;
    }
  };
}
