import { privateApi } from '@/lib/axios'
import {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/types/user.types'

export const userService = {
  async getProfile() {
    const { data } = await privateApi.get<GetProfileResponse>(`users/profile`)
    return data.data
  },

  async updateProfile(payload: UpdateProfileRequest) {
    const { data } = await privateApi.put<UpdateProfileResponse>(
      `users/profile`,
      payload,
    )
    return data.data
  },
}
