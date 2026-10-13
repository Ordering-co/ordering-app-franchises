import { useState } from 'react';
import { Alert } from 'react-native'
import dayjs from 'dayjs'

import settings from '../../../config';

import { useLanguage, useApi, useOrder, useConfig } from '@components';
import { useHomeValues } from '@ui';
import { decideBusinessForLocation, hasCartForBusiness, BusinessResolution } from './businessSelection'

const propsToFetch = ['id', 'name', 'address', 'location', 'distance', 'open', 'schedule', 'slug']

export const useNearestBusiness = () => {
  const [{ configs }] = useConfig()
  const [orderState] = useOrder()
  const [ordering] = useApi()
  const [, t] = useLanguage()
  const [{ userAddressStoraged }] = useHomeValues()

  const [nearestBusinessState, setNearestBusiness] = useState({ loading: false })

  const isValidMoment = (date: any, format: any) => dayjs.utc(date, format).format(format) === date

  const getCurrentLocation = () => {
    const defaultLatitude = Number(configs?.location_default_latitude?.value)
    const defaultLongitude = Number(configs?.location_default_longitude?.value)
    const isInvalidDefaultLocation = isNaN(defaultLatitude) || isNaN(defaultLongitude)
    const defaultLocation = isInvalidDefaultLocation ? null : { lat: defaultLatitude, lng: defaultLongitude }
    return orderState?.options?.address?.location || userAddressStoraged?.location || defaultLocation
  }

  const buildParameters = (location: any) => {
    const parameters: any = {
      location,
      type: orderState?.options?.type || 1,
      orderBy: 'distance'
    }
    if (orderState?.options?.moment && isValidMoment(orderState?.options?.moment, 'YYYY-MM-DD HH:mm:ss')) {
      parameters.timestamp = dayjs.utc(orderState?.options?.moment, 'YYYY-MM-DD HH:mm:ss').local().unix()
    }
    return parameters
  }

  const buildWhere = (extraConditions: any[] = []) => {
    const conditions = [...extraConditions]
    if (settings?.franchiseSlug) {
      conditions.push({ attribute: 'franchise_id', value: settings?.franchiseSlug })
    }
    return conditions.length ? { conditions, conector: 'AND' } : null
  }

  const fetchBusinesses = async (parameters: any, where: any) => {
    const endpoint = ordering.businesses().select(propsToFetch).parameters(parameters)
    const { content: { error, result } } = await (where ? endpoint.where(where) : endpoint).get()
    return { error, result }
  }

  const getNearestBusiness = async () => {
    const location = getCurrentLocation()

    if (!location) return

    try {
      setNearestBusiness({ ...nearestBusinessState, loading: true })

      const parameters = { ...buildParameters(location), page: 1, page_size: 5 }
      const { error, result } = await fetchBusinesses(parameters, buildWhere())

      const business = error ? null : (result?.find((business: any) => business?.open) ?? {})

      const values = {
        business,
        error: error
          ? typeof result === 'string'
            ? result
            : result[0]
          : business?.slug
            ? null
            : t('NO_BUSINESS_NEAR_LOCATION', 'No business near of you location')
      }
      setNearestBusiness({ ...nearestBusinessState, loading: false })
      return values
    } catch (err: any) {
      setNearestBusiness({ ...nearestBusinessState, loading: false })
      return {
        ...nearestBusinessState,
        error: err?.message
      }
    }
  }

  const checkBusinessCoverage = async (business: any) => {
    const location = getCurrentLocation()
    if (!location || !business?.id) return null

    try {
      const parameters = { ...buildParameters(location), page: 1, page_size: 1 }
      const where = buildWhere([{ attribute: 'id', value: business.id }])
      const { error, result } = await fetchBusinesses(parameters, where)
      if (error) return null
      return result?.find((item: any) => item?.id === business.id) ?? null
    } catch {
      return null
    }
  }

  const resolveBusinessForLocation = async (selectedBusiness: any): Promise<BusinessResolution> => {
    const coveringBusiness = selectedBusiness ? await checkBusinessCoverage(selectedBusiness) : null
    const nearest = coveringBusiness ? null : await getNearestBusiness()
    return decideBusinessForLocation({ selectedBusiness, coveringBusiness, nearest })
  }

  const confirmBusinessChange = ({ from, to }: { from: any, to: any }): Promise<boolean> => {
    const hasCart = hasCartForBusiness(orderState?.carts, from?.id)
    const message = [
      t('BUSINESS_NOT_DELIVER_TO_ADDRESS', '{{business}} does not deliver to the selected address.')
        .replace('{{business}}', from?.name ?? ''),
      t('BUSINESS_CHANGE_TO_NEAREST', 'Your order will continue with {{business}}.')
        .replace('{{business}}', to?.name ?? ''),
      hasCart ? t('BUSINESS_CHANGE_CART_LOST', 'The products in your cart will be removed.') : null
    ].filter(Boolean).join(' ')

    return new Promise((resolve) => {
      Alert.alert(
        t('BUSINESS_CHANGE_TITLE', 'Change of store'),
        message,
        [
          { text: t('CANCEL', 'Cancel'), style: 'cancel', onPress: () => resolve(false) },
          { text: t('ACCEPT', 'Accept'), onPress: () => resolve(true) }
        ],
        { cancelable: false }
      )
    })
  }

  return {
    nearestBusinessState,
    getNearestBusiness,
    checkBusinessCoverage,
    resolveBusinessForLocation,
    confirmBusinessChange
  }
}
