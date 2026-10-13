import React from 'react'

import { useApi, useOrder, useSession } from '@components'

export const AllowCurrentLocationController = (props: any) => {
  const { UIComponent, setAddressList } = props

  const [ordering] = useApi()
  const [{ user, token }] = useSession()
  const [{ options }, { changeAddress }] = useOrder()

  /**
   * This function saves an address for a user and handles any errors that may occur during the
   * process.
   * @param {any} values - The `values` parameter in the `saveAddress` function likely contains
   * information about an address that needs to be saved.
   * @returns The `saveAddress` function returns an object with two properties:
   * - `error`: a boolean value indicating if there was an error during the process
   * - `result`: the result of the operation, which could be an error message or the ID of the saved
   * address
   */
  const saveAddress = async (values: any) => {
    try {
      const { content: { error, result } } = await ordering
        .setAccessToken(token)
        .users(user?.id)
        .addresses(null)
        .save({ ...values, default: true })

      if (!error) {
        await changeAddress(result.id, {
          address: result,
          country_code: result?.country_code,
          type: options?.type
        })
        setAddressList({ ...result, insert: true })
      }
      return {
        error: !!error && typeof result === 'string' ? result : result[0]
      }
    } catch (err: any) {
      return {
        error: err?.message ?? err
      }
    }
  }

  /**
  * Function to make an address as default address
  * @param {object} address Address to make as default
  */
  const handleSetDefault = async (address: any) => {
    try {
      const { content: { error, result } } = await ordering
        .setAccessToken(token)
        .users(user?.id)
        .addresses(address.id)
        .save({ default: true })

      if (!error && result.default) {
        await changeAddress(result.id, {
          country_code: result?.country_code,
          type: options?.type
        })
      }
      return {
        error: !!error && typeof result === 'string' ? result : result[0]
      }
    } catch (err: any) {
      return {
        error: err?.message ?? err
      }
    }
  }

  return (
    UIComponent && (
      <UIComponent
        {...props}
        saveAddress={saveAddress}
        handleSetDefault={handleSetDefault}
      />
    )
  )
}
