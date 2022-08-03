export const encodeToBase64 = (str: string | Buffer): string => Buffer.from(str).toString('base64')

export const decodeFromBase64 = (base64str: string): Buffer => Buffer.from(base64str, 'base64')
