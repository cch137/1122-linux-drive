export default function sum (...args: number[]) {
  return args.reduce((a, b) => a + b, 0)
}
