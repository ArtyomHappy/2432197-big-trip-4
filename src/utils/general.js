function getRandomNumber(min, max) {
  const leftBorder = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const rightBorder = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const randomNumber = Math.random() * (rightBorder - leftBorder + 1) + leftBorder;

  return Math.floor(randomNumber);
}

function getRandomArrayElement(items) {
  return items[getRandomNumber(0, items.length - 1)];
}

function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

function generateDescription(items) {
  const sentencesCount = getRandomNumber(1, 5);
  let description = '';

  for (let i = 0; i < sentencesCount; i ++) {
    description = `${description} ${getRandomArrayElement(items) }`;
  }

  return description;
}

function getLastWord(string) {
  const wordsList = string.split(' ');

  return wordsList.at(-1);
}

export { getRandomNumber, getRandomArrayElement, capitalize, generateDescription, getLastWord };
