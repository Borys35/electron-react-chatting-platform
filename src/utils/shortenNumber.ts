function shortenNumber(number: number) {
  const word = number.toString();
  if (word.length >= 7) return `${(number / 1000000).toFixed(1)}M`;
  else if (word.length >= 4) return `${(number / 1000).toFixed(1)}K`;
  return word;
}

export default shortenNumber;
