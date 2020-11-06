import Joi from '@hapi/joi';

export const UserSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    telephone: Joi.string().required(),
  
})

export const SigninSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

export const ChangePasswordSchema =  Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
})