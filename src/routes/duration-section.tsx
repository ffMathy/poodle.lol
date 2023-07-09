
export function getDurationsInMinutes() {
  const result = new Array<number>();
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      result.push(h * 60 + m)
    }
  }

  result.splice(0, 1);

  return result;
}

export function renderLabelFromValue(durationInMinutes: number) {
  if (durationInMinutes < 60)
    return `${durationInMinutes}m`;

  const hours = Math.floor(durationInMinutes / 60);
  if (durationInMinutes % 60 === 0)
    return `${hours}h`

  return `${hours}h ${durationInMinutes % 60}m`;
}