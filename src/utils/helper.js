export function removeHours(date, hours) {
  const dateData = new Date(date);

  dateData.setTime(dateData.getTime() - hours * 60 * 60 * 1000);

  return dateData;
}

export function addHours(date, hours) {
  const dateData = new Date(date);

  dateData.setTime(dateData.getTime() + hours * 60 * 60 * 1000);

  return dateData;
}
