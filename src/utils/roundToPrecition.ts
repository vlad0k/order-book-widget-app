const roundToPrecition = (num: number, example: number) => {
  const decimalsAmount = ~(example + '').indexOf('.') ? (example + '').split('.')[1].length : 0

  const arr = num.toString().split('.')

  if (arr[1]?.length) {
    arr[1] = arr[1].slice(0, decimalsAmount)
  }

  return +arr.join('.')
}

export default roundToPrecition
