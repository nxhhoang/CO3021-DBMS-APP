import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import {
  AddressReqParams,
  CreateAddressReqBody,
  UpdateAddressReqBody,
  UpdateProfileReqBody
} from '~/models/requests/User.requests'
import userService from '~/services/user.services'

export const getProfileController = async (req: Request, res: Response) => {
  const userId = req.decoded_authorization!.userId
  const result = await userService.getProfile(userId)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.GET_PROFILE_SUCCESS, data: result })
}

export const updateProfileController = async (
  req: Request<ParamsDictionary, unknown, UpdateProfileReqBody>,
  res: Response
) => {
  const userId = req.decoded_authorization!.userId
  const result = await userService.updateProfile(userId, req.body)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.UPDATE_PROFILE_SUCCESS, data: result })
}

export const getAddressesController = async (req: Request, res: Response) => {
  const userId = req.decoded_authorization!.userId
  const result = await userService.getAddresses(userId)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.GET_ADDRESSES_SUCCESS, data: result })
}

export const createAddressController = async (
  req: Request<ParamsDictionary, unknown, CreateAddressReqBody>,
  res: Response
) => {
  const userId = req.decoded_authorization!.userId
  const result = await userService.createAddress(userId, req.body)
  res.status(HTTP_STATUS.CREATED).json({ message: USER_MESSAGES.CREATE_ADDRESS_SUCCESS, data: result })
}

export const updateAddressController = async (
  req: Request<AddressReqParams, unknown, UpdateAddressReqBody>,
  res: Response
) => {
  const userId = req.decoded_authorization!.userId
  const addressId = parseInt(req.params.addressID)
  const result = await userService.updateAddress(addressId, userId, req.body)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.UPDATE_ADDRESS_SUCCESS, data: result })
}

export const deleteAddressController = async (req: Request<AddressReqParams>, res: Response) => {
  const userId = req.decoded_authorization!.userId
  const addressId = parseInt(req.params.addressID)
  await userService.deleteAddress(addressId, userId)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.DELETE_ADDRESS_SUCCESS })
}

export const setDefaultAddressController = async (req: Request<AddressReqParams>, res: Response) => {
  const userId = req.decoded_authorization!.userId
  const addressId = parseInt(req.params.addressID)
  await userService.setDefaultAddress(addressId, userId)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.SET_DEFAULT_ADDRESS_SUCCESS })
}
