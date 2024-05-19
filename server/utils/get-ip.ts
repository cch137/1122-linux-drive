import type { IncomingMessage } from "http"

function getIp (req: IncomingMessage): string {
  // @ts-ignore
  const ips: string = req?.headers['x-forwarded-for'] || req?.headers['x-real-ip'] || req?.ip || ''
  return ips.split(',').map((i) => i.trim())[0]
}

export default getIp
