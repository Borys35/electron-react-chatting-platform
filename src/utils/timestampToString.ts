function twoDigitNumber(number: number) {
  if (number.toString().length === 1) return `0${number}`;
  else return number.toString();
}

function timestampToString(timestamp: any) {
  const now = new Date();
  const date = timestamp.toDate() as Date;

  const time = `${date.getHours()}:${twoDigitNumber(date.getMinutes())}`;

  if (now.getDate() === date.getDate()) return `Today ${time}`;
  else if (now.getDate() === date.getDate() + 1) return `Yesterday ${time}`;
  else {
    return `${date.toLocaleDateString("en-US")}`;
  }
  // const date = new Date();
  // date.setSeconds(seconds);
  // return `${date.toLocaleDateString("en-US", {
  //   weekday: "long",
  // })} ${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

export default timestampToString;
