import React, { useState, useEffect, useRef } from 'react'
import FastImage from 'react-native-fast-image';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon, Circle } from 'react-native-maps'
import Geocoder from 'react-native-geocoding';

import { GoogleMapsParams } from '../../types';
import { GoogleMapUtils } from './utils';
import { getMapCoordinate, getMapRegionFromLocation, isValidMapLocation } from './getMapRegion'

import { useLanguage, useConfig } from '@components'
import { Alert } from '@ui';

export const GoogleMap = (props: GoogleMapsParams) => {
  const {
    location,
    handleChangeAddressMap,
    maxLimitLocation,
    readOnly,
    markerTitle,
    saveLocation,
    setSaveLocation,
    handleToggleMap,
    locations,
    isIntGeoCoder,
    businessZones,
    delta,
    autoCompleteAddress,
    setAutoCompleteAddress,
    manualZoom,
    onPressMarker,
    timeMsToFit,
    unableAnimateLocation,
    changeMarkerOnLocationChange,
    useNearbyLocations,
    draggable,
    fitAfterLocationChange
  } = props

  const mapErrors: any = {
    ERROR_NOT_FOUND_ADDRESS: 'Sorry, we couldn\'t find an address',
    ERROR_MAX_LIMIT_LOCATION: `Sorry, You can only set the position to ${maxLimitLocation}m`
  }

  const { width, height } = Dimensions.get('window')
  const ASPECT_RATIO = width / height
  const DELTA = {
    latitudeDelta: delta ?? 0.0010,
    longitudeDelta: (delta ?? 0.0010) * ASPECT_RATIO
  }

  const { aproxEqual, calculateDistance, units, types, fillStyles } = GoogleMapUtils()

  const [, t] = useLanguage()
  const [configState] = useConfig()

  let mapRef = useRef<any>(null)

  const [markerImageLoaded, setMarkerImageLoaded] = useState(0)
  const mapCoordinate = getMapCoordinate(location)
  const mapRegion = getMapRegionFromLocation(location, DELTA)
  const [markerPosition, setMarkerPosition] = useState(mapCoordinate ?? { latitude: 0, longitude: 0 })
  const [region, setRegion] = useState<any>(mapRegion ?? { latitude: 0, longitude: 0, ...DELTA })
  const [MARKERS, SETMARKERS] = useState(locations)
  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<string>, key?: string | null }>({ open: false, content: [], key: null })

  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value
  const [center] = useState({ lat: location?.lat, lng: location?.lng })

  const geocodePosition = (pos: { latitude: number, longitude: number }, isMovingRegion?: boolean) => {
    Geocoder.from({
      latitude: pos.latitude,
      longitude: pos.longitude
    }).then(({ results }) => {
      let zipcode = null
      if (results && results.length > 0) {
        for (const component of results[0].address_components) {
          const addressType = component.types[0]
          if (addressType === 'postal_code') {
            zipcode = component.short_name
            break
          }
        }
        const address = {
          address: results[0]?.formatted_address,
          location: results[0]?.geometry?.location,
          zipcode,
          place_id: results[0]?.place_id,
        }
        const details = {
          geometry: { location: { lat: pos.latitude, lng: pos.longitude } },
          address_components: results[0]?.address_components,
        }
        handleChangeAddressMap && handleChangeAddressMap(address, details, { justLocation: true })
        setSaveLocation && setSaveLocation(false)
        if (!isMovingRegion) {
          handleToggleMap && handleToggleMap()
        }
      } else {
        setMapErrors && setMapErrors('ERROR_NOT_FOUND_ADDRESS')
      }
    }).catch(err => {
      setMapErrors && setMapErrors(err.message)
    })
  }

  const validateResult = (curPos: any) => {
    const loc1 = center
    const loc2 = curPos
    const distance = calculateDistance(loc1, loc2)

    if (!maxLimitLocation) {
      geocodePosition(curPos)
      setMarkerPosition(curPos)
      setRegion({
        longitude: !autoCompleteAddress ? (curPos?.longitude || 0) : curPos?.longitude,
        latitude: !autoCompleteAddress ? (curPos?.latitude || 0) : curPos?.latitude,
        latitudeDelta: !autoCompleteAddress ? (curPos?.latitudeDelta || DELTA.latitudeDelta) : DELTA.latitudeDelta,
        longitudeDelta: !autoCompleteAddress ? (curPos?.longitudeDelta || DELTA.longitudeDelta) : DELTA.longitudeDelta,
      })
      return
    }

    const _maxLimitLocation = typeof maxLimitLocation === 'string' ? parseInt(maxLimitLocation, 10) : maxLimitLocation

    if (distance <= _maxLimitLocation) {
      if (!aproxEqual(curPos?.latitude, center.lat) || !aproxEqual(curPos?.longitude, center.lng)) {
        geocodePosition(curPos, true)
      }
      setMarkerPosition(curPos)
      setRegion({
        longitude: !autoCompleteAddress ? (curPos?.longitude || 0) : curPos?.longitude,
        latitude: !autoCompleteAddress ? (curPos?.latitude || 0) : curPos?.latitude,
        latitudeDelta: !autoCompleteAddress ? (curPos?.latitudeDelta || DELTA.latitudeDelta) : DELTA.latitudeDelta,
        longitudeDelta: !autoCompleteAddress ? (curPos?.longitudeDelta || DELTA.longitudeDelta) : DELTA.longitudeDelta,
      })
    } else {
      setMapErrors && setMapErrors('ERROR_MAX_LIMIT_LOCATION')
      setMarkerPosition({ latitude: center.lat, longitude: center.lng })
    }
  }

  const closeAlert = () => {
    setAlertState({ open: false, content: [] })
  }

  const setMapErrors = (errKey: string) => {
    setAlertState({
      open: true,
      content: !(errKey === 'ERROR_MAX_LIMIT_LOCATION')
        ? [t(errKey, mapErrors[errKey])]
        : [`${t(errKey, mapErrors[errKey])} ${maxLimitLocation} ${t('METTERS', 'meters')}`],
      key: errKey
    })
  }

  const fitAllMarkers = (locations: any) => {
    const _locations = locations?.filter((_: any, i: number) => useNearbyLocations ? i < 10 : true)?.map((location: any) => ({ latitude: location.lat, longitude: location.lng }))
    mapRef.current.fitToCoordinates(_locations, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  }

  useEffect(() => {
    if (!changeMarkerOnLocationChange) return
    const nextRegion = getMapRegionFromLocation(location, DELTA)
    const nextMarker = getMapCoordinate(location)
    if (!nextRegion || !nextMarker) return
    setRegion(nextRegion)
    setMarkerPosition(nextMarker)
    fitAfterLocationChange && mapRef.current.fitToCoordinates([nextMarker], {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  }, [JSON.stringify(location)])

  useEffect(() => {
    if (saveLocation) {
      geocodePosition(markerPosition)
    }
  }, [saveLocation])

  useEffect(() => {
    const interval = setInterval(() => {
      if (mapRef.current && locations && !manualZoom) {
        fitAllMarkers(locations)
      }
    }, timeMsToFit ?? 1000)
    if (locations) {
      fitAllMarkers(locations)
      SETMARKERS(locations)
    }
    return () => clearInterval(interval)
  }, [JSON.stringify(locations)])

  useEffect(() => {
    if (isIntGeoCoder) return
    Geocoder.init(googleMapsApiKey)
  }, [isIntGeoCoder])

  if (!isValidMapLocation(location)) return null

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        style={styles.map}
        onRegionChangeComplete={!readOnly ? (coordinates) => { validateResult(coordinates) } : () => { }}
        zoomTapEnabled
        zoomEnabled
        zoomControlEnabled
        moveOnMarkerPress
        onMapReady={() => { Platform.OS === 'ios' && mapRef.current.animateToRegion(region, 0.0010) }}
        ref={mapRef}
      >
        {locations ? (
          <>
            {MARKERS && MARKERS.map((marker: { lat: number, lng: number, title: string, icon: string }, i: number) => (
              <Marker
                key={i}
                zIndex={i}
                coordinate={{ latitude: marker.lat ?? 0, longitude: marker.lng ?? 0 }}
                onPress={() => onPressMarker?.(marker)}
                title={marker?.title}
                tracksViewChanges={!(markerImageLoaded === MARKERS.length)}
              >
                <FastImage
                  source={typeof marker?.icon === 'number'
                    ? marker?.icon
                    : { uri: marker?.icon, priority: FastImage.priority.high }}
                  style={{ width: 35, height: 35 }}
                  onLoadEnd={() => setMarkerImageLoaded(markerImageLoaded + 1)}
                />
              </Marker>
            ))}
          </>
        ) : (
          <Marker
            coordinate={markerPosition}
            draggable={draggable}
            onDragEnd={(e) => {
              draggable && validateResult(e.nativeEvent.coordinate)
            }}
            title={markerTitle || t('YOUR_LOCATION', 'Your Location')}
          />
        )}
        {businessZones?.length > 0 && businessZones.filter((item: any) => types.includes(item?.type)).map((businessZone: any, i: number) => (
          <React.Fragment key={i}>
            {businessZone?.type === 2 && Array.isArray(businessZone?.data) && (
              <Polygon
                coordinates={businessZone?.data.map((item: any) => ({ latitude: item.lat, longitude: item.lng }))}
                fillColor={fillStyles.fillColor}
                strokeColor={fillStyles.strokeColor}
                strokeWidth={fillStyles.strokeWidth}
              />
            )}
            {(businessZone.type === 1 && businessZone?.data?.center && businessZone?.data?.radio) && (
              <Circle
                center={{ latitude: businessZone?.data?.center.lat, longitude: businessZone?.data?.center.lng }}
                radius={businessZone?.data.radio * 1000}
                fillColor={fillStyles.fillColor}
                strokeColor={fillStyles.strokeColor}
                strokeWidth={fillStyles.strokeWidth}
              />
            )}
            {(businessZone.type === 5 && businessZone?.data?.distance) && (
              <Circle
                center={{ latitude: center.lat, longitude: center.lng }}
                radius={businessZone?.data.distance * units[businessZone?.data?.unit]}
                fillColor={fillStyles.fillColor}
                strokeColor={fillStyles.strokeColor}
                strokeWidth={fillStyles.strokeWidth}
              />
            )}
          </React.Fragment>
        ))}
      </MapView >
      <Alert
        open={alertState.open}
        onAccept={closeAlert}
        onClose={closeAlert}
        content={alertState.content}
        title={t('ERROR', 'Error')}
      />
    </>
  )
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  }
})
