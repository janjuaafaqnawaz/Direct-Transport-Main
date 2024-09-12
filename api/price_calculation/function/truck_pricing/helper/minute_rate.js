export default function MinuteRate(distance) {
  let minute_rate = 0;

  console.log("MinuteRate", distance);

  if (distance >= 0 && distance <= 20) {
    minute_rate = 120;
  } else if (distance > 20 && distance <= 30.5) {
    minute_rate = 135;
  } else if (distance > 30.5 && distance <= 40) {
    minute_rate = 150;
  } else if (distance > 40 && distance <= 50) {
    minute_rate = 180;
  } else if (distance > 50 && distance <= 60) {
    minute_rate = 195;
  } else {
    minute_rate = 220; // for distances greater than 60 km
  }

  return minute_rate;
}
