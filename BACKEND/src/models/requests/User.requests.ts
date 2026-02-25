import { ParamsDictionary } from 'express-serve-static-core'

export interface UpdateProfileReqBody {
  fullName?: string
  phoneNum?: string
  avatar?: string
}

export interface CreateAddressReqBody {
  addressLine: string
  city: string
  district: string
  isDefault: boolean
}

export interface UpdateAddressReqBody {
  addressLine?: string
  city?: string
  district?: string
  isDefault?: boolean
}

export interface AddressReqParams extends ParamsDictionary {
  addressID: string
}
