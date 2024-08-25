export default function MinuteRate(distance) {
  let minute_rate = 0;

  // Determine the minute rate based on the distance
  if (distance >= 0 && distance <= 20) {
    minute_rate = 120;
  } else if (distance >= 21 && distance <= 30) {
    minute_rate = 135;
  } else if (distance >= 31 && distance <= 40) {
    minute_rate = 150;
  } else if (distance >= 41 && distance <= 50) {
    minute_rate = 180;
  } else if (distance >= 51 && distance <= 60) {
    minute_rate = 195;
  } else {
    minute_rate = 220; // for distances greater than 60 km
  }

  return minute_rate;
}
