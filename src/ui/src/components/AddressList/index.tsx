import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { TouchableRipple } from 'react-native-paper'
import { useTheme } from 'styled-components/native';

import { AddressListParams } from '../../types'
import { AddressItem, Container, Content } from './styles'
import { AddressSectionList } from './AddressSectionList'
import { runSetDefaultThenNavigate, getAddressListContinueState } from './shouldNavigateAfterSetDefault'

import { AddressList as AddressListController, useLanguage, useOrder } from '@components'
import {
  OButton,
  OText,
  OAlert,
  OIcon,
  OrderTypeSelector,
  FloatingBottomContainer,
  BusinessesListing,
  useNearestBusiness,
  useBusinessSelected,
  AllowCurrentLocation,
  OBottomPopup,
  useHomeValues,
  NotFoundSource
} from '@ui'

const AddressListUI = (props: AddressListParams) => {
  const {
    navigation,
    addressList,
    isNewUser,
    actionStatus,
    handleSetDefault,
    handleDelete,
    setAddressList,
    disableContinue,
    loadAddresses,
    goBack,
    onNavigationRedirect
  } = props

  const theme = useTheme()
  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const { resolveBusinessForLocation, confirmBusinessChange } = useNearestBusiness()
  const [businessSelected, { onChangeBusinessSelected }] = useBusinessSelected()
  const [{ alternativeHome, userAddressStoraged }, { onChangeAlternativeHome }] = useHomeValues()

  const [refreshing] = useState(false)
  const [toggleAllowLocation, setToggleAllowLocation] = useState(false)
  const [showAddressList, setShowAddressList] = useState(false)
  const [currentOrderType, setCurrentOrderType] = useState(orderState?.options?.type)
  const [nearestBusinessState, setNearestBusiness] = useState({ loading: false })
  const [addressSelected, setAddressSelected] = useState<any>(null)
  const [isCanceledGeolocation, setIsCanceledGeolocation] = useState(false)
  const [isSettingAddress, setIsSettingAddress] = useState(false)
  const pendingSetDefaultRef = useRef<Promise<unknown> | null>(null)

  const uniqueAddressesList = (addressList.addresses && addressList.addresses.filter(
    (address: any, i: number, self: any) => address.address &&
      i === self.findIndex((obj: any) => (
        address.address === obj.address &&
        address.address_notes === obj.address_notes &&
        address.zipcode === obj.zipcode &&
        address.internal_number === obj.internal_number
      )))) || []

  const checkAddress = (address: any) => {
    if (!orderState?.options?.address) return false
    const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number']
    const values: any = []
    const addressToCompare = addressSelected ?? orderState?.options?.address
    props.forEach(prop => {
      if (address[prop]) {
        if (prop === 'location') {
          values.push(address[prop].lat === addressToCompare?.[prop]?.lat && address[prop].lng === addressToCompare?.[prop]?.lng)
        } else {
          values.push(address[prop] === addressToCompare?.[prop])
        }
      } else {
        values.push(addressToCompare?.[prop] === null || addressToCompare?.[prop] === '')
      }
    })
    return values.every((value: any) => value)
  }

  const handleSetAddress = async (address: any) => {
    if (address.id === orderState?.options?.address_id) return
    setAddressSelected(address)
    setIsSettingAddress(true)
    const pending = Promise.resolve(handleSetDefault(address))
    pendingSetDefaultRef.current = pending
    try {
      await pending
    } finally {
      setIsSettingAddress(false)
    }
  }

  const handleSaveAddress = (address: any) => {
    let found = false
    const addresses = addressList.addresses.map((_address: any) => {
      if (_address?.id === address?.id) {
        Object.assign(_address, address)
        found = true
      } else if (address.default) {
        _address.default = false
      }
      return _address
    })
    if (!found) {
      addresses.push(address)
    }
    addressList.addresses?.length === 0
      ? onNavigationRedirect('BottomTab', { screen: 'Business' })
      : goBack()
    setAddressList({ ...addressList, addresses })
  }

  const handleOnRefresh = () => {
    if (!addressList.loading) {
      loadAddresses && loadAddresses()
    }
  }

  const addressFormProps = {
    address: null,
    onSaveAddress: handleSaveAddress,
    addressesList: addressList?.addresses,
    isSelectedAfterAdd: true,
    hasAddressDefault: !!orderState.options?.address?.location
  }

  const handleFetchBusinesses = async () => {
    const pending = pendingSetDefaultRef.current
    const goToBusiness = async () => {
      const params: any = { screen: 'Business' }
      if (currentOrderType === 1) {
        setNearestBusiness({ loading: true })
        const resolution = await resolveBusinessForLocation(businessSelected)
        setNearestBusiness({ loading: false })

        if (!resolution?.error && resolution?.business?.slug) {
          if (resolution.changed) {
            const accepted = await confirmBusinessChange({ from: businessSelected, to: resolution.business })
            if (!accepted) return
          }
          await onChangeBusinessSelected(resolution.business)
          params.store = resolution.business.slug
        }
      }

      onNavigationRedirect('BottomTab', params)
    }

    if (pending) {
      await runSetDefaultThenNavigate({
        setDefault: () => pending,
        navigate: goToBusiness
      })
      return
    }

    await goToBusiness()
  }

  const continueState = getAddressListContinueState({
    hasAddress: orderState.options?.address?.address,
    disableContinue,
    locationPromptOpen: toggleAllowLocation,
    orderLoading: orderState.loading,
    actionLoading: actionStatus.loading,
    nearestLoading: nearestBusinessState.loading,
    isSettingAddress,
    selectedAddressId: addressSelected?.id,
    cartAddressId: orderState.options?.address_id
  })

  useEffect(() => {
    !userAddressStoraged && setToggleAllowLocation(orderState?.options.type !== 1)
  }, [orderState?.options.type, userAddressStoraged])

  useEffect(() => {
    if (alternativeHome && !addressList?.loading) {
      onChangeAlternativeHome(false)
    }
  }, [alternativeHome, addressList?.loading])

  useEffect(() => {
    const cartAddress = orderState?.options?.address
    if (
      addressSelected?.id != null &&
      String(addressSelected.id) !== String(cartAddress?.id ?? '')
    ) {
      return
    }
    setAddressSelected(cartAddress)
  }, [JSON.stringify(orderState?.options?.address)])

  useEffect(() => {
    if (uniqueAddressesList.some((address: any) => address.route === null)) {
      handleOnRefresh()
    }
  }, [uniqueAddressesList?.length])

  useEffect(() => {
    if (!orderState?.options?.address?.address && orderState?.options?.type !== 1 && isCanceledGeolocation) {
      onNavigationRedirect(
        'AddressForm',
        addressFormProps
      )
    }
  }, [orderState?.options?.address?.address, orderState?.options?.type, isCanceledGeolocation])

  useEffect(() => {
    setIsCanceledGeolocation(false)
  }, [currentOrderType])

  return (
    <View style={{ flex: 1 }}>
      <Container
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => handleOnRefresh()}
          />
        }
      >
        <Content>
          <OrderTypeSelector setOrderTypeValue={setCurrentOrderType} />

          {!!orderState?.options?.address?.address && currentOrderType !== 1 && (
            <AddressSectionList
              currentAddress={orderState?.options?.address?.address}
              onClick={() => setShowAddressList(!showAddressList)}
            />
          )}

          {(showAddressList || currentOrderType === 1 || !orderState?.options?.address?.address) && (
            <>
              {
                !addressList.error &&
                addressList?.addresses?.length > 0 && (
                  <View style={{ marginBottom: 20 }}>
                    <OText
                      weight={Platform.OS === 'ios' ? '600' : 'bold'}
                      size={theme.utils.tsize.m}
                    >
                      {t('MY_SAVED_ADDRESS', 'My saved address')}
                    </OText>
                    <View
                      style={{ flexDirection: 'column', gap: 20, marginTop: 20 }}
                    >
                      {uniqueAddressesList.map((address: any, i: any) => (
                        <AddressItem
                          key={address.id + i}
                          disabled={actionStatus.loading}
                          isSelected={checkAddress(address)}
                          onPress={() => handleSetAddress(address)}
                        >
                          {actionStatus.loading && addressSelected?.id === address.id ? (
                            <ActivityIndicator color={theme.colors.primary} size='small' style={{ marginEnd: 16 }} />
                          ) : (
                            <OIcon
                              src={actionStatus.loading ? theme.images.general.radio_nor : checkAddress(address) ? theme.images.general.radio_act : theme.images.general.radio_nor}
                              width={16}
                              color={actionStatus.loading ? theme.colors.disabled : checkAddress(address) ? theme.colors.primary : theme.colors.disabled}
                              style={{ marginEnd: 16 }}
                            />
                          )}
                          <OText style={styles.address} size={theme.utils.tsize.xs}>{address.address}</OText>
                          <TouchableRipple
                            onPress={() => onNavigationRedirect(
                              'AddressForm',
                              {
                                address: address,
                                isEditing: true,
                                addressesList: addressList,
                                onSaveAddress: handleSaveAddress,
                                isSelectedAfterAdd: true,
                                hasAddressDefault: !!orderState.options?.address?.location
                              }
                            )}
                          >
                            <OIcon
                              width={16}
                              src={theme.images.general.pencil}
                              style={{ marginHorizontal: 4 }}
                            />
                          </TouchableRipple>
                          {!checkAddress(address) && (
                            <OAlert
                              title={t('DELETE_ADDRESS', 'Delete Address')}
                              message={t('QUESTION_DELETE_ADDRESS', 'Are you sure to you wants delete the selected address')}
                              onAccept={() => handleDelete(address)}
                              disabled={checkAddress(address)}
                            >
                              <OIcon
                                src={theme.images.general.trash}
                                width={16}
                                color={theme.colors.disabled}
                              />
                            </OAlert>
                          )}
                        </AddressItem>
                      ))}
                    </View>
                  </View>
                )
              }

              {!addressList.loading && !addressList.error && (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => onNavigationRedirect('AddressForm', addressFormProps)}
                  style={{ marginBottom: orderState?.options?.type !== 1 ? 40 : 120 }}
                >
                  <OText
                    color={theme.colors.primary}
                    size={theme.utils.tsize.s}
                  >
                    {t('ADD_NEW_ADDRESS', 'Add new Address')}
                  </OText>
                </TouchableOpacity>
              )}

              {addressList.loading && addressList?.addresses?.length === 0 && !isNewUser && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <Placeholder key={i} Animation={Fade}>
                      <View style={{ flexDirection: 'row', marginBottom: 20, alignItems: 'center' }}>
                        <PlaceholderLine width={8} height={25} style={{ marginRight: 15, marginTop: 10, borderRadius: 50 }} />
                        <Placeholder>
                          <PlaceholderLine width={70} />
                          <PlaceholderLine width={40} />
                          <PlaceholderLine width={70} />
                        </Placeholder>
                      </View>
                    </Placeholder>
                  ))}
                </>
              )}
            </>
          )}
        </Content>

        {!!orderState?.options?.address?.address && orderState?.options?.type !== 1 && (
          <BusinessesListing navigation={navigation} />
        )}
        {!orderState?.options?.address?.address && currentOrderType !== 1 && orderState?.options?.type !== 1 && (
          <NotFoundSource
            content={t('NO_ADDRESS_FOUND_FOR_BUSINESS_PICKUP', 'Please add an address for show businesses near your location')}
          />
        )}
      </Container>
      {continueState.visible && (
        <FloatingBottomContainer isStatic>
          <OButton
            text={t('CONTINUE', 'Continue')}
            isLoading={continueState.loading}
            onClick={() => continueState.loading ? {} : handleFetchBusinesses()}
          />
        </FloatingBottomContainer>
      )}
      <OBottomPopup
        open={toggleAllowLocation}
        presentationStyle='overFullScreen'
        transparent={true}
        containerStyle={{
          borderRadius: 10,
          borderTopRightRadius: theme.utils.radius.l,
          borderTopLeftRadius: theme.utils.radius.l
        }}
        bottomContainerStyle={{
          borderRadius: theme.utils.radius.l
        }}
        titleComponent={
          <AllowLocationTitle
            icon={theme.images.general.pin}
            text={t('ALLOW_USE_YOUR_LOCATION', 'Would you like to use your location?')}
          />
        }
        onClose={() => {
          setToggleAllowLocation(!toggleAllowLocation)
          setIsCanceledGeolocation(true)
        }}
      >
        <AllowCurrentLocation
          addresses={uniqueAddressesList}
          setAddressList={props.handleAddressRegister}
          onClose={() => setToggleAllowLocation(!toggleAllowLocation)}
          setIsCanceledGeolocation={setIsCanceledGeolocation}
        />
      </OBottomPopup>
    </View>
  )
}

const AllowLocationTitle = ({ icon, text }: any) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 10 }}>
      <OIcon src={icon} width={20} />
      <OText size={16}>{'  '}{text}</OText>
    </View>
  )
}

const styles = StyleSheet.create({
  address: {
    flex: 1,
    marginHorizontal: 5
  }
})

export const AddressList = (props: AddressListParams) => {
  const addressListProps = {
    ...props,
    UIComponent: AddressListUI
  }
  return <AddressListController {...addressListProps} />
}
