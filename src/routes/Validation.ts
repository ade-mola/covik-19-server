import { Joi } from 'celebrate'

export const UserSchema = Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(255).required()
  })

export const TokenSchema =  { token: Joi.string().token().required() }

export const EmailSchema =  { email: Joi.string().email().required() }