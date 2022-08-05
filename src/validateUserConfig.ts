import Joi from 'joi'
import { UserConfig } from './type'

const userConfigSchema = Joi.object({
  outDir: Joi.string().required(),
  urlFilter: Joi.alt(Joi.string().required(), Joi.function().required(), Joi.object().regex().required()).required(),
  site: Joi.string().required(),
  headless: Joi.boolean(),
  viewportSize: Joi.string(),
}).required()

export const validateUserConfig: (config: UserConfig) => void = (config: UserConfig): asserts config is UserConfig => {
  const result = userConfigSchema.validate(config)
  if (result.error) {
    throw result.error
  }
}
