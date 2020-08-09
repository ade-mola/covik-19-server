import { Joi } from 'celebrate'

export const NewUserSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().min(5).max(255).required(),
  notification_token: Joi.string(),
})

export const ExistingUserSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().min(5).max(255).required(),
  notification_token: Joi.string(),
})

export const TokenSchema = { token: Joi.string().token().required() }

export const EmailSchema = { email: Joi.string().email().required() }

export const NewClusterSchema = Joi.object().keys({
  userId: Joi.string().required(),
  time: Joi.string().required(),
  location: Joi.string().required().regex(/-?\d+\.?\d*\:{1}-?\d+\.?\d*/)
})

export const clusterSchema = Joi.array().items(NewClusterSchema)

export const TestResultSchema = Joi.object().keys({
  userId: Joi.string().required(),
  checkInTime: Joi.string().required(), // Date as ISO string
  isPositive: Joi.boolean().required()
})