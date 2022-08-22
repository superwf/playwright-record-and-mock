import Joi from 'joi'
import { Config } from './type'

const userConfigSchema = Joi.object({
  outDir: Joi.string().required(),
  urlFilter: Joi.alt(Joi.string().required(), Joi.function().required(), Joi.object().regex().required()).required(),
  responseHeadersInterceptor: Joi.function(),
  site: Joi.string().required(),
  shouldRecordALlInOne: Joi.boolean(),
  generateResponseMapKey: Joi.function(),
}).required()

export const validateUserConfig: (config: Config) => void = (config: Config): asserts config is Config => {
  const result = userConfigSchema.validate(config)
  if (result.error) {
    throw result.error
  }
}
