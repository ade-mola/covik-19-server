import { Joi } from 'celebrate'

export const UserSchema = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(255).required(),
    notificationToken: Joi.string().required(),
  })

export const TokenSchema =  { token: Joi.string().token().required() }

export const EmailSchema =  { email: Joi.string().email().required() }

export const NewClusterSchema =   Joi.object().keys({
  userId: Joi.string().required(),
  time: Joi.string().required(),
  location: Joi.string().required().regex(/-?\d+\.?\d*\:{1}-?\d+\.?\d*/)
})

export const TestResultSchema =   Joi.object().keys({
  userId: Joi.string().required(),
  checkInTime: Joi.string().required(), // Date as ISO string
  isPositive: Joi.boolean().required()
})