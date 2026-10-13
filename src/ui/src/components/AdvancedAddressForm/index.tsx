import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { useTheme } from 'styled-components/native';
import { useForm, Controller } from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import Geocoder from 'react-native-geocoding';

import {
  AddressFormContainer,
  AutocompleteInput,
  IconsContainer,
  GoogleMapContainer,
  FormInput,
} from './styles';

import {
  AddressForm as AdvancedAddressFormController,
  useLanguage,
  useConfig,
  useSession,
  useOrder,
  useToast,
  ToastType
} from '@components';

import {
  GPSButton,
  DeviceOrientationMethods,
  OInput,
  OButton,
  OModal,
  OIcon,
  GoogleMap,
  NavBar,
  AddressDetails,
  OrderConfig,
  useBusinessSelected,
  Alert
} from '@ui';

import { getTraduction } from '../../utils';
import { AddressFormParams } from '../../types';
import { ORDER_TYPES } from '../../config/constants';
import GooglePlacesTextInput from 'react-native-google-places-textinput';

const { useDeviceOrientation } = DeviceOrientationMethods

const inputNames = [
  { name: 'address', code: 'Address' },
  { name: 'internal_number', code: 'Internal number' },
  { name: 'zipcode', code: 'Zipcode' },
  { name: 'address_notes', code: 'Address notes' },
];

const googleFields = [
  'place_id',
  'formatted_address',
  'geometry/location',
  'address_components',
].join(',');

const AdvancedAddressFormUI = (props: AddressFormParams) => {
  const {
    navigation,
    updateChanges,
    address,
    formState,
    isEditing,
    handleChangeInput,
    addressState,
    addressesList,
    saveAddress,
    isGuestUser,
    isRequiredField,
    showField,
    afterSignup,
    getNearestBusiness,
    businessNearestState,
    enableGoBackOnContinue
  } = props;

  const theme = useTheme();
  const [orientationState] = useDeviceOrientation();

  const isEmptyField = (key: any, str: any) => isRequiredField && isRequiredField(key) && (!str || str.trim().length === 0)

  const [autoCompleteInputFocused, setAutoCompleteInputFocused] = useState(false)
  const [, { onChangeBusinessSelected }] = useBusinessSelected()
  const tagsName = [
    { icon: theme.images.general.tag_home, value: 'home' },
    { icon: theme.images.general.tag_building, value: 'office' },
    { icon: theme.images.general.tag_heart, value: 'favorite' },
    { icon: theme.images.general.tag_plus, value: 'other' },
  ];

  const HEIGHT_SCREEN = orientationState?.dimensions?.height

  const styles = StyleSheet.create({
    iconContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingVertical: 5,
      backgroundColor: theme.colors.clear
    },
    inputsStyle: {
      borderRadius: 10,
      marginBottom: 20,
      height: 50,
      maxHeight: 50,
      minHeight: 50,
      flex: 1,
    },
    textAreaStyles: {
      borderRadius: 10,
      marginBottom: 20,
      height: 104,
      maxHeight: 104,
      minHeight: 104,
      textAlignVertical: 'top',
      alignItems: 'flex-start',
    },
    pinIcon: {
      position: 'absolute',
      start: 0,
      top: 12,
      zIndex: 1002,
      left: Platform.OS === 'ios' ? 5 : 15,
      marginLeft: 10,
      width: 16
    },
    wrapperNavbar: Platform.OS === 'ios'
      ? { paddingVertical: 0, paddingLeft: 20, paddingRight: 20 }
      : { paddingVertical: 10, paddingLeft: 20, paddingRight: 20 }
  });

  const [, t] = useLanguage();
  const [{ auth }] = useSession();
  const [, { showToast }] = useToast();
  const [configState] = useConfig();
  const [orderState, { changeMoment }] = useOrder();
  const { handleSubmit, errors, control, setValue } = useForm();
  const [autoCompleteAddress, setAutoCompleteAddress] = useState(false)

  const [toggleAddressForm, setToggleAddressForm] = useState(false);
  const [alertState, setAlertState] = useState<{
    open: boolean;
    content: Array<string>;
    key?: string | null;
  }>({ open: false, content: [], key: null });
  const [addressTag, setAddressTag] = useState(addressState?.address?.tag || orderState?.options?.address?.tag);
  const [firstLocationNoEdit, setFirstLocationNoEdit] = useState({
    value: { lat: null, lng: null },
    address: null,
  });
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [locationChange, setLocationChange] = useState(
    isEditing
      ? addressState?.address?.location
      : formState.changes?.location ?? null,
  );

  const [saveMapLocation, setSaveMapLocation] = useState(false);
  const [isShowEditMap, setIsShowEditMap] = useState(false)
  const [isOpenConfirmAddress, setIsOpenConfirmAddress] = useState(false)
  const [addressSelected, setAddressSelected] = useState(orderState?.options?.address?.address)
  const [googleAddressValue, setGoogleAddressValue] = useState(
    address?.address ||
    formState.changes?.address ||
    addressState.address.address ||
    orderState?.options?.address?.address ||
    '',
  );
  const googleInput: any = useRef(null);
  const internalNumberRef: any = useRef(null);
  const zipCodeRef: any = useRef(null);
  const addressNotesRef: any = useRef(null);

  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value;
  const isLocationRequired =
    configState.configs?.google_autocomplete_selection_required?.value ===
    '1' ||
    configState.configs?.google_autocomplete_selection_required?.value ===
    'true';
  const maxLimitLocation =
    configState?.configs?.meters_to_change_address?.value;
  const countryCode = configState?.configs?.country_autocomplete?.value
  const isHideMap = theme?.address?.components?.map?.hidden
  const isHideIcons = theme?.address?.components?.icons?.hidden
  const handleRedirectContinue = () => {
    navigation?.navigate('BottomTab', { screen: 'Business' })
  }

  const goToBack = () => navigation?.canGoBack() && navigation.goBack();

  const mapConfigs = {
    mapZoom: 16,
    mapSize: {
      width: 640,
      height: 500
    }
  };

  const getAddressFormatted = (address: any) => {
    const data: any = { address: null, error: null };
    Geocoder.from(address)
      .then((json) => {
        if (json.results && json.results?.length > 0) {
          let postalCode = null;
          for (const component of json.results?.[0].address_components) {
            const addressType = component.types?.[0];
            if (addressType === 'postal_code') {
              postalCode = component.short_name;
              break;
            }
          }
          data.address = {
            address,
            location: json.results[0].geometry.location,
            map_data: {
              library: 'google',
              place_id: json.results?.[0].place_id,
            },
          };
          if (postalCode) {
            data.address.zipcode = postalCode;
          }

          const arrayList = isEditing
            ? addressesList?.addresses?.filter(
              (address: any) => address.id !== addressState?.address?.id,
            ) || []
            : addressesList || [];
          const addressToCompare = isEditing
            ? { ...addressState.address, ...data.address, ...formState.changes }
            : { ...data.address, ...formState?.changes };

          const isAddressAlreadyExist =
            arrayList
              .map((address: any) => checkAddress(address, addressToCompare))
              .some((value: any) => value) ?? false;

          if (!isAddressAlreadyExist) {
            saveAddress(data.address);

            if (!isGuestUser && !auth) {

              onChangeBusinessSelected(businessNearestState?.business || null)
              enableGoBackOnContinue
                ? goToBack()
                : handleRedirectContinue()
            }
            return;
          }

          setAlertState({
            open: true,
            content: [t('ADDRESS_ALREADY_EXIST', 'The address already exists')],
          });
        } else {
          setAlertState({
            open: true,
            content: [t('ERROR_NOT_FOUND_ADDRESS', 'Error, address not found')],
          });
        }
      })
      .catch((error) => {
        setAlertState({
          open: true,
          content: [error?.message || error?.toString()],
        });
      });
  };

  const onSubmit = async () => {
    setToggleAddressForm(false)
    setIsOpenConfirmAddress(false)
    if (
      !auth &&
      formState?.changes?.address === '' &&
      addressState?.address?.address
    ) {
      setAlertState({
        open: true,
        content: [
          t(
            'VALIDATION_ERROR_ADDRESS_REQUIRED',
            'The field Address is required',
          ),
        ],
      });
      return;
    }
    if (formState?.changes?.address && !formState?.changes?.location) {
      if (isLocationRequired) {
        setAlertState({
          open: true,
          content: [
            t(
              'ADDRESS_REQUIRE_LOCATION',
              'The address needs a location, please select one of the suggested',
            ),
          ],
        });
        return;
      }
      getAddressFormatted(formState?.changes?.address);
      return;
    }

    const arrayList = isEditing
      ? addressesList?.addresses?.filter(
        (address: any) => address.id !== addressState?.address?.id,
      ) || []
      : addressesList || [];
    const addressToCompare = isEditing
      ? { ...addressState.address, ...formState.changes }
      : formState?.changes;

    const isAddressAlreadyExist =
      arrayList
        .map((address: any) => checkAddress(address, addressToCompare))
        .some((value: any) => value) ?? false;
    if (!isAddressAlreadyExist) {
      await saveAddress();
      if (!isGuestUser && !afterSignup) {
        onChangeBusinessSelected(businessNearestState?.business || null)

        enableGoBackOnContinue
          ? goToBack()
          : handleRedirectContinue()
      }
      return;
    }

    setAlertState({
      open: true,
      content: [t('ADDRESS_ALREADY_EXIST', 'The address already exists')],
    });
  };

  /**
   * Returns true when the user made no changes
   * @param {object} address
   */
  const checkAddress = (address: any, addressToCompare: any) => {
    const props = [
      'address',
      'address_notes',
      'zipcode',
      'location',
      'internal_number',
    ];
    const values: any = [];
    props.forEach((prop) => {
      if (addressToCompare[prop]) {
        if (prop === 'location') {
          values.push(
            address[prop]?.lat === addressToCompare[prop]?.lat &&
            address[prop]?.lng === addressToCompare[prop]?.lng,
          );
        } else {
          values.push(address[prop] === addressToCompare[prop]);
        }
      } else {
        values.push(!address[prop]);
      }
    });
    return values.every((value: any) => value);
  };

  const handleChangeAddress = (data: any, details: any) => {
    const addressSelected = {
      address: data?.description || data?.address,
      location: details?.geometry?.location,
      utc_offset: details?.utc_offset || null,
      map_data: { library: 'google', place_id: data.place_id },
      zip_code: data?.zip_code || null,
    };
    setAddressSelected(addressSelected?.address)
    updateChanges(addressSelected);
    if (orderState?.options?.moment) {
      changeMoment(null)
    }
  };

  const handleAddressTag = (tag: string) => {
    setAddressTag(tag);
    handleChangeInput({
      target: {
        name: 'tag',
        value: tag,
      },
    });
  };

  const handleToggleAddressForm = () => {
    setToggleAddressForm(!toggleAddressForm);
  };

  const showFieldWithTheme = (name: any) => {
    return !theme?.address?.components?.[name]?.hidden
  }

  const handleGoToPreorder = async () => {
    navigation.navigate('MomentOption', {
      business: businessNearestState?.business
    })
    setToggleAddressForm(false)
    setIsOpenConfirmAddress(false)
  }

  const handleConfirmConfigs = () => {
    if (orderState?.options?.type === ORDER_TYPES[0]?.value && !businessNearestState?.business) {
      setAlertState({
        key: 'ERROR_NOT_FOUND_NEAR_BUSINESS',
        open: true,
        content: [t('ERROR_NOT_FOUND_NEAR_BUSINESS', 'Error, business not found near your location')],
      })
      return
    }
    onSubmit()
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: [],
      key: null
    })
  }

  useEffect(() => {
    const excludedKeys: any = ['ERROR_NOT_FOUND_NEAR_BUSINESS', 'ERROR_MAX_LIMIT_LOCATION']
    if (alertState.open && !excludedKeys.includes(alertState?.key)) {
      alertState.content && showToast(ToastType.Error, alertState.content);
    }
  }, [alertState.content]);

  useEffect(() => {
    if (!auth) {
      inputNames.forEach((field) =>
        setValue(
          field.name,
          formState?.changes[field.name] ||
          (orderState?.options?.address &&
            orderState?.options?.address[field.name]) ||
          '',
        ),
      );
      return;
    }

    if (!formState.loading && formState.result?.error) {
      setAlertState({
        open: true,
        content: formState.result?.result || [t('ERROR', 'Error')],
      });
    }

    setValue(
      'address',
      formState?.changes?.address ?? addressState.address?.address ?? '',
    );
    if (!isEditing) {
      formState?.changes?.address &&
        setLocationChange(formState?.changes?.location);
      if (
        formState?.changes?.address &&
        formState?.changes?.address !== firstLocationNoEdit?.address &&
        formState?.changes?.location &&
        formState?.changes?.location?.lat !== firstLocationNoEdit.value?.lat &&
        formState?.changes?.location?.lng !== firstLocationNoEdit.value?.lng
      ) {
        setFirstLocationNoEdit({
          value: formState?.changes?.location,
          address: formState?.changes?.address,
        });
      }
    }

    if (isEditing) {
      if (formState?.changes?.location) {
        const prevLocation = {
          lat: locationChange?.lat?.toFixed(5),
          lng: locationChange?.lng?.toFixed(5),
        };
        const newLocation = {
          lat: formState?.changes?.location?.lat?.toFixed(5),
          lng: formState?.changes?.location?.lng?.toFixed(5),
        };
        if (
          prevLocation?.lat !== newLocation?.lat &&
          prevLocation?.lng !== newLocation?.lng
        ) {
          setLocationChange(formState?.changes?.location);
        }
      }
    }
  }, [formState]);

  useEffect(() => {
    if (formState?.result?.result && !formState?.loading) {
      if (formState.result?.error) {
        showToast(ToastType.Error, formState.result.result);
      } else {
        showToast(
          ToastType.Success,
          t('UPDATE_SUCCESSFULLY', 'Update successfully'),
        );
      }
    }
  }, [formState.result]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  useEffect(() => {
    setGoogleAddressValue(
      address?.address ||
      formState.changes?.address ||
      addressState.address.address ||
      orderState?.options?.address?.address ||
      '',
    );
  }, []);

  useEffect(() => {
    if (!orderState?.options?.address && !orderState?.loading) {
      setAddressSelected(null);
      setGoogleAddressValue('');
      googleInput?.current?.blur?.();
    }
  }, [orderState?.options?.address, orderState?.loading]);

  useEffect(() => {
    Geocoder.init(googleMapsApiKey);
  }, [googleMapsApiKey]);

  useEffect(() => {
    const location = {
      lat: formState.changes?.location?.lat || orderState?.options?.address?.location?.lat,
      lng: formState.changes?.location?.lng || orderState?.options?.address?.location?.lng
    }
    if (location?.lat && location?.lng) {
      getNearestBusiness(location)
    }
  }, [
    JSON.stringify(formState.changes?.location),
    orderState?.options?.moment,
    orderState?.options?.type
  ])

  return (
    <View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <AddressFormContainer style={{ overflow: 'scroll', marginBottom: Platform.OS === 'ios' ? 20 : 0 }}>
          <View>
            <FormInput>
              <AutocompleteInput>
                <Controller
                  control={control}
                  name="address"
                  defaultValue={
                    address?.address ||
                    formState.changes?.address ||
                    addressState.address.address ||
                    ''
                  }
                  rules={{
                    required:
                      isRequiredField && isRequiredField('address')
                        ? t(
                          `VALIDATION_ERROR_ADDRESS_REQUIRED`,
                          `The field Address is required`,
                        )
                        : null,
                  }}
                  render={() => (
                    <GooglePlacesTextInput
                      placeHolderText={t('ADD_ADDRESS', 'Add a address')}
                      apiKey={googleMapsApiKey}
                      value={googleAddressValue}
                      fetchDetails
                      showClearButton={false}
                      showLoadingIndicator={false}
                      includedRegionCodes={countryCode && countryCode !== '*' ? [countryCode] : undefined}
                      ref={googleInput}
                      onPlaceSelect={async (place) => {
                        try {
                          const res = await fetch(
                            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place?.placeId}&key=${googleMapsApiKey}&fields=${encodeURIComponent(googleFields)}`
                          );
                          const json = await res.json();
                          const details = json?.result;
                          const data = {
                            description: details?.formatted_address,
                            address: details?.formatted_address,
                            place_id: details?.place_id
                          };
                          handleChangeAddress(data, details);
                          setAutoCompleteAddress(true);
                        } catch (error) {
                          console.log('onFail', error);
                        }
                      }}
                      onFocus={() => {
                        setAutoCompleteInputFocused(true);
                        setAutoCompleteAddress(true);
                      }}
                      onBlur={() => {
                        setAutoCompleteInputFocused(false);
                        setAutoCompleteAddress(false);
                      }}
                      onError={(error) => {
                        const errorMessage =
                          typeof error === 'string'
                            ? error
                            : error?.message || error?.toString?.() || t('ERROR', 'Error');
                        setAlertState({
                          open: true,
                          content: [getTraduction(errorMessage, t, true)],
                        });
                      }}
                      onTextChange={(text) => {
                        if (!isFirstTime) {
                          handleChangeInput({
                            target: { name: 'address', value: text },
                          });
                          setValue('address', text);
                          setGoogleAddressValue(text);
                          setAutoCompleteAddress(true);
                        }
                        setIsFirstTime(false);
                      }}
                      style={{
                        suggestionsContainer: {
                          borderBottomStartRadius: 15,
                          borderBottomEndRadius: 15,
                          elevation: 2,
                          borderWidth: 1,
                          borderColor: '#ddd',
                          bottom: 20,
                        },
                        suggestionItem: {
                          backgroundColor: '#fff',
                        },
                        container: {
                          zIndex: 100,
                        },
                        input: {
                          borderWidth: 1,
                          borderRadius: 7.6,
                          borderColor: autoCompleteInputFocused ? theme.colors.primary : theme.colors.border,
                          flexGrow: 1,
                          fontSize: 15,
                          paddingLeft: 36,
                          paddingRight: 18,
                          minHeight: 50,
                          fontFamily: 'Poppins-Regular',
                          marginBottom: 24,
                        },
                      }}
                    />
                  )}
                />

                {(
                  ((!isEditing && !isGuestUser) ||
                    (isEditing && !isGuestUser)) ||
                  (isGuestUser)) &&
                  (
                    <View style={styles.pinIcon}>
                      <GPSButton
                        apiKey={googleMapsApiKey}
                        handleGPS={(data: any, detail: any) => {
                          handleChangeAddress(data, detail);
                          setValue('address', data.address);
                          if (googleInput?.current) {
                            setGoogleAddressValue(data.address);
                            googleInput?.current?.blur?.();
                          }
                        }}
                        IconButton={<OIcon src={theme.images.general.pin} width={16} color={theme?.colors?.primary} />}
                        isIntGeoCoder
                      />
                    </View>
                  )}
              </AutocompleteInput>

              {!isHideMap && (locationChange || formState.changes?.location || orderState?.options?.address?.location) && (
                <View
                  style={{
                    height: HEIGHT_SCREEN - (Platform.OS === 'ios' ? 430 : 380),
                    borderRadius: 7.6,
                    overflow: 'hidden',
                    marginBottom: 24,
                  }}>
                  <GoogleMapContainer>
                    {isShowEditMap ? (
                      <GoogleMap
                        location={locationChange || formState.changes?.location || orderState?.options?.address?.location}
                        handleChangeAddressMap={handleChangeAddress}
                        maxLimitLocation={maxLimitLocation}
                        saveLocation={saveMapLocation}
                        setSaveLocation={setSaveMapLocation}
                        isIntGeoCoder
                        setAutoCompleteAddress={setAutoCompleteAddress}
                        autoCompleteAddress={autoCompleteAddress}
                      />
                    ) : (
                      <AddressDetails
                        isShowOnlyMap
                        showModalForEditMap
                        orderLocation={formState.changes?.location}
                        location={formState.changes?.location}
                        mapConfigs={mapConfigs}
                        mapHeight={HEIGHT_SCREEN - 380}
                        addressToDeliver={addressSelected}
                        callback={() => setIsShowEditMap(true)}
                      />
                    )}
                  </GoogleMapContainer>
                </View>
              )}
            </FormInput>
          </View>
          <View>
            {!!addressSelected && (
              <OButton
                text={
                  !formState.loading
                    ? t('CONTINUE', 'Continue')
                    : t('LOADING', 'Loading')
                }
                onClick={() => handleToggleAddressForm()}
                isDisabled={formState.loading || businessNearestState?.loading}
                style={{ borderRadius: 7.6, shadowOpacity: 0 }}
              />
            )}
          </View>
          <OModal
            open={toggleAddressForm}
            onClose={() => handleToggleAddressForm()}
            entireModal
            customClose
            showToastInsideModal
          >
            <View style={{
              height: Platform.OS === 'ios' ? HEIGHT_SCREEN - 50 : HEIGHT_SCREEN,
            }}>
              <NavBar
                title={t('COMPLETE_ADDRESS', 'COMPLETE ADDRESS')}
                onActionLeft={() => handleToggleAddressForm()}
              />
              <View
                style={{
                  padding: 20,
                  flex: 1
                }}
              >
                <FormInput>
                  <View style={{ flexDirection: 'row' }}>
                    {showField?.('internal_number') && ((isRequiredField && isRequiredField('internal_number')) || showFieldWithTheme('internal_number')) && (
                      <Controller
                        control={control}
                        name="internal_number"
                        rules={{
                          required:
                            isRequiredField && isRequiredField('internal_number')
                              ? t(
                                `VALIDATION_ERROR_INTERNAL_NUMBER_REQUIRED`,
                                `The field internal number is required`,
                              )
                              : null,
                        }}
                        defaultValue={
                          address?.internal_number ||
                          formState.changes?.internal_number ||
                          addressState?.address?.internal_number ||
                          orderState?.options?.address?.internal_number ||
                          ''
                        }
                        render={() => (
                          <OInput
                            name="internal_number"
                            placeholder={t('INTERNAL_NUMBER', 'Internal number')}
                            onChange={(data: any) => {
                              handleChangeInput(data);
                              setValue('internal_number', isEmptyField('internal_number', data?.target?.value) ? null : data);
                            }}
                            value={
                              address?.internal_number ||
                              formState.changes?.internal_number ||
                              addressState?.address?.internal_number ||
                              orderState?.options?.address?.internal_number ||
                              ''
                            }
                            isFocusHighlight
                            style={{
                              ...styles.inputsStyle,
                              marginRight: showField?.('internal_number') && showField?.('zipcode') ? 24 : 0
                            }}
                            ref={internalNumberRef}
                            returnKeyType="next"
                            onSubmitEditing={() => zipCodeRef?.current?.focus?.()}
                            blurOnSubmit={false}
                          />
                        )}
                      />
                    )}

                    {showField?.('zipcode') && ((isRequiredField && isRequiredField('zipcode')) || showFieldWithTheme('zipcode')) && (
                      <Controller
                        control={control}
                        name="zipcode"
                        rules={{
                          required:
                            isRequiredField && isRequiredField('zipcode') && !(address?.zipcode || formState.changes?.zipcode || addressState.address.zipcode)
                              ? t(
                                `VALIDATION_ERROR_ZIP_CODE_REQUIRED`,
                                `The field Zip Code is required`,
                              )
                              : null,
                        }}
                        defaultValue={
                          address?.zipcode ||
                          formState.changes?.zipcode ||
                          addressState.address.zipcode ||
                          orderState?.options?.address?.zipcode ||
                          ''
                        }
                        render={() => (
                          <OInput
                            name="zipcode"
                            placeholder={t('ZIP_CODE', 'Zip code')}
                            onChange={(data: any) => {
                              handleChangeInput(data);
                              setValue('zipcode', isEmptyField('zipcode', data?.target?.value) ? null : data);
                            }}
                            value={
                              address?.zipcode ||
                              formState.changes?.zipcode ||
                              addressState.address.zipcode ||
                              orderState?.options?.address?.zipcode ||
                              ''
                            }
                            isFocusHighlight
                            style={styles.inputsStyle}
                            ref={zipCodeRef}
                            returnKeyType="next"
                            onSubmitEditing={() => addressNotesRef?.current?.focus?.()}
                            blurOnSubmit={false}
                          />
                        )}
                      />
                    )}
                  </View>

                  {showField?.('address_notes') && ((isRequiredField && isRequiredField('address_notes')) || showFieldWithTheme('address_notes')) && (
                    <Controller
                      control={control}
                      name="address_notes"
                      rules={{
                        required:
                          isRequiredField && isRequiredField('address_notes')
                            ? t(
                              `VALIDATION_ERROR_ADDRESS_NOTES_REQUIRED`,
                              `The field address notes is required`,
                            )
                            : null,
                      }}
                      defaultValue={
                        address?.address_notes ||
                        formState.changes?.address_notes ||
                        addressState.address.address_notes ||
                        orderState?.options?.address?.address_notes ||
                        ''
                      }
                      render={() => (
                        <OInput
                          name="address_notes"
                          placeholder={t('ADDRESS_NOTES', 'Address notes')}
                          onChange={(data: any) => {
                            handleChangeInput(data);
                            setValue('address_notes', isEmptyField('address_notes', data?.target?.value) ? null : data);
                          }}
                          value={
                            address?.address_notes ||
                            formState.changes?.address_notes ||
                            addressState.address.address_notes ||
                            orderState?.options?.address?.address_notes ||
                            ''
                          }
                          multiline
                          isFocusHighlight
                          style={styles.textAreaStyles}
                          returnKeyType="done"
                          ref={addressNotesRef}
                          blurOnSubmit
                        />
                      )}
                    />
                  )}
                </FormInput>
                {!isHideIcons && (
                  <IconsContainer>
                    {tagsName.map((tag) => (
                      <TouchableOpacity
                        key={tag.value}
                        onPress={() => handleAddressTag(tag.value)}>
                        <View
                          style={{
                            ...styles.iconContainer,
                          }}>
                          <OIcon
                            src={tag.icon}
                            width={24}
                            color={
                              addressTag === tag.value ?
                                theme.colors.primary : theme.colors.disabled
                            }
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </IconsContainer>
                )}
              </View>
              <OButton
                text={t('CONTINUE', 'CONTINUE')}
                imgRightSrc={null}
                parentStyle={{ padding: 20 }}
                onClick={() => handleConfirmConfigs()}
              />
            </View>
            <OrderConfig
              navigation={navigation}
              isOpenConfirmAddress={isOpenConfirmAddress}
              setIsOpenConfirmAddress={setIsOpenConfirmAddress}
              addressSelected={addressSelected}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              businessNearestState={businessNearestState}
              handleGoToPreorder={handleGoToPreorder}
            />
            {alertState?.open && (
              <Alert
                open={alertState?.open && alertState?.key === 'ERROR_NOT_FOUND_NEAR_BUSINESS'}
                title={t('BUSINESS_ALERT', 'Business alert')}
                content={alertState?.content}
                onClose={closeAlert}
                onAccept={closeAlert}
              />
            )}
          </OModal>
          <Spinner visible={saveMapLocation} />
        </AddressFormContainer>
      </TouchableWithoutFeedback>
    </View>
  );
};

export const AdvancedAddressForm = (props: AddressFormParams) => {
  const advancedAddressFormProps = {
    ...props,
    UIComponent: AdvancedAddressFormUI,
  };
  return <AdvancedAddressFormController {...advancedAddressFormProps} />;
};
