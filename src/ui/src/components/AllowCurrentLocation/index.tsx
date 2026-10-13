import React, { useEffect, useRef, useState } from 'react';
import { AppState, Linking, PermissionsAndroid, Platform, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import Geocoder from 'react-native-geocoding'
import Geolocation from '@react-native-community/geolocation'

import { ErrorMessage, WrapperButtons } from './styles'
import { AllowCurrentLocationController } from './functions'

import { useLanguage, useConfig, useOrder } from '@components'
import { OButton, OText, useHomeValues } from '@ui'

const AllowCurrentLocationUI = (props: any) => {
  const {
    addresses,
    onClose,
    saveAddress,
    handleSetDefault,
    setIsCanceledGeolocation
  } = props

  const [, { onChangeUserAddressStoraged }] = useHomeValues()
  const [, t] = useLanguage()
  const [{ options }] = useOrder()
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const [locationState, setLocationState] = useState({ location: null, loading: false, error: '', blocked: false })
  const settingsOpened = useRef(false)
  const [retryAfterSettings, setRetryAfterSettings] = useState(false)

  const googleMapsApiKey = configs?.google_maps_api_key?.value;

  const handleChangeAddress = async (data: any) => {
    const addressToCompare = {
      ...data,
      map_data: { library: 'google', place_id: data.place_id }
    }

    const isAddressAlreadyExist =
      addresses
        .map((address: any) => checkAddress(address, addressToCompare))
        .findIndex((value: any) => value) ?? false;

    let result = null
    if (isAddressAlreadyExist < 0) {
      result = await saveAddress(addressToCompare)
    } else {
      const currentAddressId = options?.address_id
      const address = addresses[isAddressAlreadyExist]
      if (currentAddressId !== address.id) {
        result = await handleSetDefault(address)
      }
    }

    setLocationState({ ...locationState, loading: false, error: result?.error })
    if (!result?.error) {
      onChangeUserAddressStoraged(addressToCompare)
      onClose()
    }
  }

  const checkAddress = (address: any, addressToCompare: any) => {
    const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number']
    const values: any = []
    props.forEach(prop => {
      if (address[prop]) {
        if (prop === 'location') {
          values.push(address[prop].lat === addressToCompare?.[prop]?.lat && address[prop].lng === addressToCompare?.[prop]?.lng)
        } else {
          values.push(address[prop] === addressToCompare?.[prop])
        }
      } else {
        values.push(addressToCompare?.[prop] === null || addressToCompare?.[prop] === '' || addressToCompare?.[prop] === undefined)
      }
    })
    return values.every((value: any) => value)
  }

  const geoCodePosition = (pos: { latitude: number, longitude: number }) => {
    Geocoder.from({
      latitude: pos.latitude,
      longitude: pos.longitude
    }).then(({ results }: any) => {
      if (results && results.length > 0) {
        let zipcode = null;
        let index = 0;
        while (zipcode === null && index < results.length) {
          const component = results[index].address_components;
          const postalCodeType = component.find((c: any) => c.types.includes('postal_code'));
          if (postalCodeType) {
            zipcode = postalCodeType.short_name;
          }
          index++;
        }
        const data = {
          address: results[0]?.formatted_address,
          utc_offset: results[0]?.utc_offset ?? null,
          location: results[0]?.geometry?.location,
          zipcode,
          place_id: results[0]?.place_id,
        };
        handleChangeAddress(data)
        return
      }
      setLocationState({ ...locationState, loading: false, error: t('NO_ADDRESS_FOUND', 'No address found') });
    }).catch((err: any) => {
      let errorMsg = '';

      const errorMessages: any = {
        0: t('GEOCODING_NOT_INITIATED', 'Geocoding service not initiated properly'),
        1: t('GEOCODING_INVALID_PARAMETERS', 'Invalid parameters for geocoding'),
        2: t('GEOCODING_FETCHING_ERROR', 'Error while fetching location data'),
        3: t('GEOCODING_PARSING_ERROR', 'Error while parsing location data'),
        4: () => {
          if (err.origin && err.origin.status) {
            const statusMessages: any = {
              'ZERO_RESULTS': t('NO_ADDRESS_FOUND', 'No address found for this location'),
              'OVER_QUERY_LIMIT': t('OVER_QUERY_LIMIT', 'Too many requests, please try again later'),
              'REQUEST_DENIED': t('REQUEST_DENIED', 'Location service request denied'),
              'INVALID_REQUEST': t('INVALID_REQUEST', 'Invalid location request')
            };
            return statusMessages[err.origin.status] || t('GEOCODING_SERVER_ERROR', `Server error: ${err.origin.status}`);
          }
          return t('GEOCODING_SERVER_ERROR', 'Error from the geocoding server');
        }
      };

      errorMsg = typeof errorMessages[err.code] === 'function'
        ? errorMessages[err.code]()
        : errorMessages[err.code] || err.message || t('GEOCODING_UNKNOWN_ERROR', 'Unknown geocoding error');

      setLocationState({ ...locationState, loading: false, error: errorMsg });
    });
  }

  const getCurrentPosition = async () => {
    const geolocationCodeErrors: any = {
      1: 'PERMISSION_DENIED',
      2: 'POSITION_UNAVAILABLE',
      3: 'TIMEOUT'
    }
    if (locationState.loading) return
    if (locationState.blocked) {
      settingsOpened.current = true
      Linking.openSettings()
      return
    }
    setLocationState({ ...locationState, loading: true, error: '', blocked: false })
    if (Platform.OS === 'android') {
      const results = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ])
      const statuses = Object.values(results)
      if (!statuses.includes(PermissionsAndroid.RESULTS.GRANTED)) {
        setLocationState({
          ...locationState,
          loading: false,
          error: t('ERROR_CURRENT_LOCATION_PERMISSION_DENIED', 'Location permission denied'),
          blocked: statuses.includes(PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
        })
        return
      }
    }
    Geolocation.getCurrentPosition((pos: any) => {
      geoCodePosition(pos.coords)
    }, (err: any) => {
      setLocationState({
        ...locationState,
        loading: false,
        error: t(`ERROR_CURRENT_LOCATION_${geolocationCodeErrors[err?.code]}`, err?.message),
        blocked: err?.code === 1
      })
    }, {
      enableHighAccuracy: false, timeout: 30000
    })
  }

  useEffect(() => {
    if (!googleMapsApiKey) return
    Geocoder.init(googleMapsApiKey)
  }, [googleMapsApiKey])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && settingsOpened.current) {
        settingsOpened.current = false
        setLocationState(prev => ({ ...prev, blocked: false }))
        setRetryAfterSettings(true)
      }
    })
    return () => subscription.remove()
  }, [])

  const checkAndroidPermission = async () => {
    const fine = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    const coarse = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
    const granted = fine || coarse
    setLocationState(prev => ({ ...prev, blocked: !granted, error: granted ? '' : prev.error }))
  }

  useEffect(() => {
    if (!retryAfterSettings) return
    setRetryAfterSettings(false)
    if (Platform.OS === 'android') {
      checkAndroidPermission()
      return
    }
    getCurrentPosition()
  }, [retryAfterSettings])

  return (
    <View>
      <WrapperButtons>
        {(Platform.OS !== 'ios' || !!locationState?.error) && (
          <OButton
            text={t('QUIT', 'Quit')}
            textStyle={{ fontSize: theme.utils.tsize.s }}
            imgRightSrc={null}
            style={{ borderRadius: theme.utils.radius.l, height: 44 }}
            onClick={() => {
              onClose()
              setIsCanceledGeolocation?.(true)
            }}
          />
        )}
        <OButton
          text={t('ALLOW', 'Allow')}
          textStyle={{ fontSize: theme.utils.tsize.s }}
          imgRightSrc={null}
          style={{ borderRadius: theme.utils.radius.l, height: 44 }}
          isLoading={locationState.loading}
          onClick={() => getCurrentPosition()}
        />
      </WrapperButtons>
      {!!locationState?.error && (
        <ErrorMessage>
          <OText size={16} weight={'600'} color={theme.colors.error}>
            {locationState?.error}
          </OText>
        </ErrorMessage>
      )}
    </View>
  );
};

export const AllowCurrentLocation = (props: any) => {
  const componentProps = {
    ...props,
    UIComponent: AllowCurrentLocationUI
  }
  return (
    <AllowCurrentLocationController {...componentProps} />
  );
}
