import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { CreateSampleReqBody } from '~/models/requests/Sample.requests'
import sampleService from '~/services/sample.services'

export const getSamplesController = async (req: Request, res: Response) => {
  const result = await sampleService.getSamples()
  res.status(HTTP_STATUS.OK).json({
    message: 'Get samples successfully',
    data: result
  })
}

export const createSampleController = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: Request<ParamsDictionary, any, CreateSampleReqBody>,
  res: Response
) => {
  const result = await sampleService.createSample(req.body)
  res.status(HTTP_STATUS.CREATED).json({
    message: 'Create sample successfully',
    data: result
  })
}

export const getMockTokenController = async (req: Request, res: Response) => {
  const token = await sampleService.generateMockToken()
  res.status(HTTP_STATUS.OK).json({
    message: 'Tạo Mock Token thành công (Dùng token này để test các API bảo mật)',
    data: { access_token: token }
  })
}

export const getAuthSampleController = async (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    message: 'Bạn đã truy cập thành công vào GET API yêu cầu xác thực!',
    data: {
      user_payload_from_token: req.decoded_authorization
    }
  })
}

export const postAuthSampleController = async (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    message: 'Bạn đã truy cập thành công vào POST API yêu cầu xác thực!',
    data: {
      body_nhan_duoc: req.body,
      user_payload_from_token: req.decoded_authorization
    }
  })
}
