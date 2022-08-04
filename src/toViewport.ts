import { Config } from './type'

export const toViewport = (viewportSize?: string): Config['viewport'] => {
  if (viewportSize) {
    const [width, height] = viewportSize.split(',').map<number>(n => parseInt(n, 10))
    return {
      width,
      height,
    }
  }
  return undefined
}
