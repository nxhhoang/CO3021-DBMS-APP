import { query, getClient } from '~/utils/postgres'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { CreateAddressReqBody, UpdateAddressReqBody, UpdateProfileReqBody } from '~/models/requests/User.requests'

class UserService {
  //  Profile

  async getProfile(userId: string) {
    const result = await query(
      `SELECT userID AS "userId", fullName AS "fullName", email, phoneNum AS "phoneNum", role
       FROM USERS WHERE userID = $1`,
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
      fields.push(`fullName = $${idx++}`)
      values.push(payload.fullName)
    }
    if (payload.phoneNum !== undefined) {
      fields.push(`phoneNum = $${idx++}`)
      values.push(payload.phoneNum)
    }


    if (fields.length === 0) return this.getProfile(userId)

    values.push(userId)
    const result = await query(
      `UPDATE USERS SET ${fields.join(', ')}
       WHERE userID = $${idx}
       RETURNING userID AS "userId", fullName AS "fullName"`,
      values
    )
    return result.rows[0]
  }

  //  Addresses

  async getAddresses(userId: string) {
    const result = await query(
      `SELECT addressID AS "addressID", addressline AS "addressline", addressname AS "addressname",
              city, district, isDefault AS "isDefault"
       FROM ADDRESSES WHERE userID = $1
       ORDER BY isDefault DESC, addressID ASC`,
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
        await client.query(`UPDATE ADDRESSES SET "isdefault" = false WHERE "userID" = $1`, [userId])
      }

      const result = await client.query(
        `INSERT INTO ADDRESSES (userID, addressline, addressname, city, district, isdefault)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING addressID AS "addressID", addressline AS "addressline"`,
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
    // 1. Kiểm tra quyền sở hữu (Verify ownership)
    const check = await query(`SELECT addressID FROM ADDRESSES WHERE addressid = $1 AND userID = $2`, [
      addressId,
      userId
    ])
    if (check.rows.length === 0) {
      throw new ErrorWithStatus({ message: USER_MESSAGES.ADDRESS_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    const fields: string[] = []
    const values: unknown[] = []
    let idx = 1

    // Dynamic fields build
    const updatableFields = ['addressline', 'addressname', 'city', 'district']
    updatableFields.forEach((field) => {
      if (payload[field as keyof UpdateAddressReqBody] !== undefined) {
        fields.push(`"${field}" = $${idx++}`) // Dùng ngoặc kép để tránh lỗi case-sensitive trong Postgres
        values.push(payload[field as keyof UpdateAddressReqBody])
      }
    })

    const client = await getClient()
    try {
      await client.query('BEGIN')

      // 2. Xử lý logic isDefault (Transaction safe)
      if (payload.isDefault === true) {
        await client.query(`UPDATE ADDRESSES SET "isdefault" = false WHERE "userid" = $1`, [userId])
        fields.push(`"isdefault" = $${idx++}`)
        values.push(true)
      } else if (payload.isDefault === false) {
        fields.push(`"isdefault" = $${idx++}`)
        values.push(false)
      }

      // Nếu không có field nào thay đổi, trả về dữ liệu cũ hoặc báo lỗi tùy logic
      if (fields.length === 0) {
        await client.query('COMMIT')
        const currentData = await query(`SELECT * FROM ADDRESSES WHERE "addressid" = $1`, [addressId])
        return currentData.rows[0]
      }

      values.push(addressId)
      const result = await client.query(
        `UPDATE ADDRESSES 
       SET ${fields.join(', ')} 
       WHERE "addressid" = $${idx}
       RETURNING *`, // Lấy hết tất cả các cột của dòng vừa update
        values
      )

      await client.query('COMMIT')
      return result.rows[0] // Trả về object đầy đủ
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  async deleteAddress(addressId: number, userId: string) {
    const check = await query(`SELECT addressID FROM ADDRESSES WHERE addressID = $1 AND userID = $2`, [
      addressId,
      userId
    ])
    if (check.rows.length === 0) {
      throw new ErrorWithStatus({ message: USER_MESSAGES.ADDRESS_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    await query(`DELETE FROM ADDRESSES WHERE addressID = $1`, [addressId])
  }

  async setDefaultAddress(addressId: number, userId: string) {
    const check = await query(`SELECT addressID FROM ADDRESSES WHERE addressID = $1 AND userID = $2`, [
      addressId,
      userId
    ])
    if (check.rows.length === 0) {
      throw new ErrorWithStatus({ message: USER_MESSAGES.ADDRESS_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    const client = await getClient()
    try {
      await client.query('BEGIN')
      await client.query(`UPDATE ADDRESSES SET isDefault = false WHERE userID = $1`, [userId])
      await client.query(`UPDATE ADDRESSES SET isDefault = true WHERE addressID = $1`, [addressId])
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
