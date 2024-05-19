const ceil = (num: number, digits = 0) => {
  digits = digits ** 10
  return Math.ceil(num * digits) / digits
}

const round = (num: number, digits = 0) => {
  digits = digits ** 10
  return Math.round(num * digits) / digits
}

const floor = (num: number, digits = 0) => {
  digits = digits ** 10
  return Math.floor(num * digits) / digits
}

export {
  ceil,
  round,
  floor
}

export default round
