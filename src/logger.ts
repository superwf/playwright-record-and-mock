import chalk from 'chalk'

export const { log } = console

export const ok = (...messages: string[]) => chalk.rgb(137, 191, 4)(messages.join())

export const info = (...messages: string[]) => chalk.rgb(66, 139, 202)(messages.join())

export const err = (...messages: string[]) => chalk.red(messages.join())
