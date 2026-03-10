import { query, getClient } from '~/utils/postgres'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { CreateAddressReqBody, UpdateAddressReqBody, UpdateProfileReqBody } from '~/models/requests/User.requests'

class UserService {
  //  Profile

  async getProfile(userId: string) {
    const result = await query(
      `SELECT user_id AS "userId", full_name AS "fullName", email, phone_num AS "phoneNum", avatar, role
       FROM users WHERE user_id = $1`,
      [userId]
    )
    if (result.rows.length === 0) {
      throw new ErrorWithStatus({ message: USER_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    return result.rows[0]
  }

  async updateProfile(userId: string, payload: UpdateProfileReqBody) {
    const fields: string[] = []
    const values: unknown[] = []
    let idx = 1

    if (payload.fullName !== undefined) {
      fields.push(`full_name = $${idx++}`)
      values.push(payload.fullName)
    }
    if (payload.phoneNum !== undefined) {
      fields.push(`phone_num = $${idx++}`)
      values.push(payload.phoneNum)
    }
    if (payload.avatar !== undefined) {
      fields.push(`avatar = $${idx++}`)
      values.push(payload.avatar)
    }

    if (fields.length === 0) return this.getProfile(userId)

    values.push(userId)
    const result = await query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW()
       WHERE user_id = $${idx}
       RETURNING user_id AS "userId", full_name AS "fullName"`,
      values
    )
    return result.rows[0]
  }

  //  Addresses

  async getAddresses(userId: string) {
    const result = await query(
      `SELECT address_id AS "addressID", address_line AS "addressLine", address_name AS "addressName",
              city, district, is_default AS "isDefault"
       FROM addresses WHERE user_id = $1
       ORDER BY is_default DESC, address_id ASC`,
      [userId]
    )
    return result.rows
  }

  async createAddress(userId: string, payload: CreateAddressReqBody) {
    const { addressLine, addressName, city, district, isDefault } = payload
    const client = await getClient()
    try {
      await client.query('BEGIN')

      if (isDefault) {
        await client.query(`UPDATE addresses SET is_default = false WHERE user_id = $1`, [userId])
      }

      const result = await client.query(
        `INSERT INTO addresses (user_id, address_line, address_name, city, district, is_default)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING address_id AS "addressID", address_line AS "addressLine"`,
        [userId, addressLine, addressName, city, district, isDefault ?? false]
      )

      await client.query('COMMIT')
      return result.rows[0]
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  async updateAddress(addressId: number, userId: string, payload: UpdateAddressReqBody) {
    // Verify ownership
    const check = await query(`SELECT address_id FROM addresses WHERE address_id = $1 AND user_id = $2`, [
      addressId,
      userId
    ])
    if (check.rows.length === 0) {
      throw new ErrorWithStatus({ message: USER_MESSAGES.ADDRESS_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    const fields: string[] = []
    const values: unknown[] = []
    let idx = 1

    if (payload.addressLine !== undefined) {
      fields.push(`address_line = $${idx++}`)
      values.push(payload.addressLine)
    }
    if (payload.addressName !== undefined) {
      fields.push(`address_name = $${idx++}`)
      values.push(payload.addressName)
    }
    if (payload.city !== undefined) {
      fields.push(`city = $${idx++}`)
      values.push(payload.city)
    }
    if (payload.district !== undefined) {
      fields.push(`district = $${idx++}`)
      values.push(payload.district)
    }

    const client = await getClient()
    try {
      await client.query('BEGIN')

      if (payload.isDefault === true) {
        await client.query(`UPDATE addresses SET is_default = false WHERE user_id = $1`, [userId])
        fields.push(`is_default = $${idx++}`)
        values.push(true)
      } else if (payload.isDefault === false) {
        fields.push(`is_default = $${idx++}`)
        values.push(false)
      }

      values.push(addressId)
      const result = await client.query(
        `UPDATE addresses SET ${fields.join(', ')} WHERE address_id = $${idx}
         RETURNING address_id AS "addressID", city, district`,
        values
      )

      await client.query('COMMIT')
      return result.rows[0]
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  async deleteAddress(addressId: number, userId: string) {
    const check = await query(`SELECT address_id FROM addresses WHERE address_id = $1 AND user_id = $2`, [
      addressId,
      userId
    ])
    if (check.rows.length === 0) {
      throw new ErrorWithStatus({ message: USER_MESSAGES.ADDRESS_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    await query(`DELETE FROM addresses WHERE address_id = $1`, [addressId])
  }

  async setDefaultAddress(addressId: number, userId: string) {
    const check = await query(`SELECT address_id FROM addresses WHERE address_id = $1 AND user_id = $2`, [
      addressId,
      userId
    ])
    if (check.rows.length === 0) {
      throw new ErrorWithStatus({ message: USER_MESSAGES.ADDRESS_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    const client = await getClient()
    try {
      await client.query('BEGIN')
      await client.query(`UPDATE addresses SET is_default = false WHERE user_id = $1`, [userId])
      await client.query(`UPDATE addresses SET is_default = true WHERE address_id = $1`, [addressId])
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }
}

const userService = new UserService()
export default userService
