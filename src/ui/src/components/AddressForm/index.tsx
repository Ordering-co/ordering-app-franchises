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
import { ScrollView } from 'react-native-gesture-handler';
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
  AddressForm as AddressFormController,
  useLanguage,
  useConfig,
  useSession,
  useOrder,
  useToast,
  ToastType
} from '@components';

import {
  GPSButton,
  OInput,
  OButton,
  OModal,
  OIcon,
  GoogleMap,
  FloatingBottomContainer
} from '@ui';

import { getTraduction } from '../../utils';
import { parseOrderTypesAllowed } from '../../utils/parseOrderTypesAllowed';
import { AddressFormParams } from '../../types';
import GooglePlacesTextInput, { GooglePlacesTextInputStyles } from 'react-native-google-places-textinput';
import { LegacyPlacesInput } from './LegacyPlacesInput';
import {
  PLACES_API_LEGACY,
  PLACES_API_NEW,
  NEW_PLACE_DETAILS_FIELDS,
  getPlacesApiMode,
  setPlacesApiMode,
  switchToLegacyPlacesApi,
  isPlacesApiNotEnabledError,
  newDetailsToLegacy,
  fetchLegacyDetails,
} from './googlePlaces';

const inputNames = [
  { name: 'address', code: 'Address' },
  { name: 'internal_number', code: 'Internal number' },
  { name: 'zipcode', code: 'Zipcode' },
  { name: 'address_notes', code: 'Address notes' },
];

const ADDRESS_BY = {
  AUTOCOMPLETE: Symbol('autocomplete'),
  GPS: Symbol('gps'),
};

const AddressFormUI = (props: AddressFormParams) => {
  const {
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
    businessSlug,
    onNavigationRedirect
  } = props;

  const theme = useTheme();

  const [autoCompleteInputFocused, setAutoCompleteInputFocused] = useState(false)

  const isEmptyField = (key: any, str: any) => isRequiredField && isRequiredField(key) && (!str || str.trim().length === 0)

  const tagsName = [
    { icon: theme.images.general.tag_home, value: 'home' },
    { icon: theme.images.general.tag_building, value: 'office' },
    { icon: theme.images.general.tag_heart, value: 'favorite' },
    { icon: theme.images.general.tag_plus, value: 'other' },
  ];

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
      top: 12,
      zIndex: 1002,
      right: Platform.OS === 'ios' ? 30 : 15,
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
  const [orderState] = useOrder();
  const { handleSubmit, errors, control, setValue } = useForm();
  const [autoCompleteAddress, setAutoCompleteAddress] = useState(false)

  const [toggleMap, setToggleMap] = useState(false);
  const [showErrors, setShowErrors] = useState(false)
  const [alertState, setAlertState] = useState<{
    open: boolean;
    content: Array<string>;
    key?: string | null;
  }>({ open: false, content: [], key: null });
  const [addressTag, setAddressTag] = useState(addressState?.address?.tag);
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
  const [currentPlace, setCurrentPlace] = useState({
    place_id:
      addressState?.address?.map_data?.place_id ||
      formState?.changes?.map_data?.place_id ||
      null,
    by: null
  });
  const [googleAddressValue, setGoogleAddressValue] = useState(
    address?.address ||
    formState.changes?.address ||
    addressState.address.address ||
    ''
  );
  const [zipcodeValue, setZipcodeValue] = useState(() => {
    return formState?.changes?.hasOwnProperty('zipcode')
      ? (formState?.changes?.zipcode ?? '')
      : (addressState?.address?.zipcode ?? '');
  })
  const [placesApiMode, setPlacesApiModeState] = useState(getPlacesApiMode());
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
  const unaddressedTypes = parseOrderTypesAllowed(configState?.configs?.unaddressed_order_types_allowed?.value)
  const isAllowUnaddressOrderType = unaddressedTypes.includes(orderState?.options?.type)

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

  const onSubmit = () => {
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

    if (formState?.changes?.address && (!formState?.changes?.location || !formState?.changes?.map_data?.place_id)) {
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
      Keyboard.dismiss()
      saveAddress()
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

  const handleChangeAddress = (data: any, details: any, options?: { by?: any, justLocation?: boolean }) => {
    if (options?.justLocation) {
      updateChanges({
        location: details?.geometry?.location
      })
      return
    }
    const addressObj: any = {}
    if (details?.address_components) {
      details.address_components.map((component: any) => {
        const addressType = component.types[0]
        if (addressType === 'postal_code') {
          addressObj.zipcode = component.short_name
        }
        if (addressType === 'postal_code_suffix') {
          addressObj.zipcode = addressObj.zipcode
            ? `${addressObj.zipcode}-${component.short_name}`
            : component.short_name
        }
        if (addressType === 'street_number') {
          addressObj.street_number = component.long_name
        }
        if (addressType === 'neighborhood') {
          addressObj.neighborhood = component.long_name
        }
        if (addressType === 'route') {
          addressObj.route = component.short_name
        }
        if (addressType === 'locality') {
          addressObj.locality = component.long_name
        }
        if (component.types?.includes('sublocality')) {
          addressObj.sublocality = component.long_name
        }
        if (addressType === 'country') {
          addressObj.country = component.long_name
          addressObj.country_code = component.short_name
        }
        if (addressType === 'administrative_area_level_1') {
          addressObj.state = component.long_name
        }
        if (addressType === 'administrative_area_level_2') {
          addressObj.city = component.long_name
        }
      })
    }

    const addressSelected = {
      address: data?.description || data?.address,
      location: details?.geometry?.location,
      utc_offset: details?.utc_offset || null,
      map_data: { library: 'google', place_id: data.place_id },
      zipcode: addressObj.zipcode || data?.zipcode || null,
      ...addressObj
    };
    if (options?.by || (currentPlace?.by === ADDRESS_BY.GPS)) {
      setCurrentPlace({
        place_id: data.place_id,
        by: currentPlace?.by || options?.by
      })
    }
    updateChanges(addressSelected);

    const zipcodeValue = addressObj.zipcode || data?.zipcode || '';
    setValue('zipcode', zipcodeValue);
  };

  const handleSelectGoogleDetails = (details: any) => {
    const data = {
      description: details?.formatted_address,
      address: details?.formatted_address,
      place_id: details?.place_id
    };
    handleChangeAddress(data, details, { by: ADDRESS_BY.AUTOCOMPLETE });
    setAutoCompleteAddress(true);
  };

  const handleGooglePlaceSelect = async (place: any) => {
    setPlacesApiMode(PLACES_API_NEW);
    try {
      const details = newDetailsToLegacy(place?.details) ??
        await fetchLegacyDetails({ placeId: place?.placeId, apiKey: googleMapsApiKey });
      handleSelectGoogleDetails(details);
    } catch (error) {
      console.log('onFail', error);
    }
  };

  const showGooglePlacesError = (error: any) => {
    const errorMessage =
      typeof error === 'string'
        ? error
        : error?.message || error?.toString?.() || t('ERROR', 'Error');
    setAlertState({
      open: true,
      content: [getTraduction(errorMessage, t, true)],
    });
  };

  const handleGooglePlacesError = (error: any) => {
    if (getPlacesApiMode() !== PLACES_API_NEW && isPlacesApiNotEnabledError(error)) {
      switchToLegacyPlacesApi();
      setPlacesApiModeState(PLACES_API_LEGACY);
      return;
    }
    showGooglePlacesError(error);
  };

  const handleGoogleTextChange = async (text: string) => {
    if (!isFirstTime) {
      handleChangeInput({
        target: { name: 'address', value: text },
      });
      setValue('address', text);
      setGoogleAddressValue(text);
      setAutoCompleteAddress(true);
      try {
        const _address = await Geocoder.from(text);
        handleChangeAddress(
          {
            address: text,
            place_id:
              currentPlace?.by === ADDRESS_BY.GPS
                ? _address.results[0].place_id
                : currentPlace?.place_id,
          },
          _address.results[0],
        );
      } catch (err) { }
    }
    setIsFirstTime(false);
  };

  const handleGoogleInputFocus = () => {
    setAutoCompleteInputFocused(true);
    setAutoCompleteAddress(true);
  };

  const handleGoogleInputBlur = () => {
    setAutoCompleteInputFocused(false);
    setAutoCompleteAddress(false);
  };

  const googlePlacesInputStyle: GooglePlacesTextInputStyles = {
    suggestionsContainer: {
      position: 'relative',
      bottom: 20,
    },
    container: {
      zIndex: 100,
    },
    input: {
      borderWidth: 1,
      borderRadius: theme.utils.radius.l,
      borderColor: autoCompleteInputFocused ? theme.colors.primary : theme.colors.border,
      flexGrow: 1,
      fontSize: 15,
      paddingLeft: 16,
      paddingRight: 32,
      minHeight: 50,
      marginBottom: 24,
    },
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

  const handleToggleMap = () => {
    setToggleMap(!toggleMap);
  };

  const showFieldWithTheme = (name: any) => {
    return !theme?.address?.components?.[name]?.hidden
  }

  useEffect(() => {
    if (alertState.open && alertState?.key !== 'ERROR_MAX_LIMIT_LOCATION') {
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

    const newZipcodeValue = formState?.changes?.hasOwnProperty('zipcode')
      ? (formState?.changes?.zipcode ?? '')
      : (addressState.address?.zipcode ?? '');
    setValue('zipcode', newZipcodeValue);
    setZipcodeValue(newZipcodeValue);
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
  }, [formState, formState.loading]);

  useEffect(() => {
    if (formState?.result && !formState?.loading) {
      if (formState?.error) {
        showToast(ToastType.Error, formState.error[0]);
      } else {
        showToast(
          ToastType.Success,
          t('UPDATE_SUCCESSFULLY', 'Update successfully'),
        );
      }
    }
  }, [formState.result]);

  useEffect(() => {
    const currentZipcodeValue = formState?.changes?.hasOwnProperty('zipcode')
      ? (formState?.changes?.zipcode ?? '')
      : (addressState.address?.zipcode ?? '');
    setZipcodeValue(currentZipcodeValue);
  }, [formState?.changes?.zipcode, addressState.address?.zipcode]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors, showErrors]);

  useEffect(() => {
    setGoogleAddressValue(
      address?.address ||
      formState.changes?.address ||
      addressState.address.address ||
      '',
    );
  }, []);

  useEffect(() => {
    Geocoder.init(googleMapsApiKey);
  }, [googleMapsApiKey])

  useEffect(() => {
    if (isAllowUnaddressOrderType) {
      onNavigationRedirect &&
        onNavigationRedirect('BottomTab', { screen: 'Business' })
    }
  }, [isAllowUnaddressOrderType])

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps='always'
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <AddressFormContainer style={{ overflow: 'scroll' }}>
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
                    render={() => placesApiMode === PLACES_API_LEGACY ? (
                      <LegacyPlacesInput
                        placeHolderText={t('ADD_ADDRESS', 'Add a address')}
                        apiKey={googleMapsApiKey}
                        value={googleAddressValue}
                        includedRegionCodes={countryCode && countryCode !== '*' ? [countryCode] : undefined}
                        ref={googleInput}
                        onPlaceSelect={handleSelectGoogleDetails}
                        onFocus={handleGoogleInputFocus}
                        onBlur={handleGoogleInputBlur}
                        onError={showGooglePlacesError}
                        onTextChange={handleGoogleTextChange}
                        style={googlePlacesInputStyle}
                      />
                    ) : (
                      <GooglePlacesTextInput
                        placeHolderText={t('ADD_ADDRESS', 'Add a address')}
                        apiKey={googleMapsApiKey}
                        value={googleAddressValue}
                        fetchDetails
                        detailsFields={NEW_PLACE_DETAILS_FIELDS}
                        showClearButton={false}
                        showLoadingIndicator={false}
                        includedRegionCodes={countryCode && countryCode !== '*' ? [countryCode] : undefined}
                        ref={googleInput}
                        onPlaceSelect={handleGooglePlaceSelect}
                        onFocus={handleGoogleInputFocus}
                        onBlur={handleGoogleInputBlur}
                        onError={handleGooglePlacesError}
                        onTextChange={handleGoogleTextChange}
                        style={googlePlacesInputStyle}
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
                            handleChangeAddress(data, detail, { by: ADDRESS_BY.GPS });
                            setValue('address', data.address);
                            if (googleInput?.current) {
                              setGoogleAddressValue(data.address);
                              googleInput?.current?.blur?.();
                            }
                          }}
                          IconButton={<OIcon src={theme.images.general.pin} width={16} />}
                          isIntGeoCoder
                        />
                      </View>
                    )}
                </AutocompleteInput>

                {!isHideMap && (locationChange || formState.changes?.location) && (
                  <View
                    style={{
                      height: 189,
                      borderRadius: theme.utils.radius.l,
                      overflow: 'hidden',
                      marginBottom: 24,
                    }}>
                    <GoogleMapContainer>
                      <GoogleMap
                        changeMarkerOnLocationChange
                        readOnly
                        isIntGeoCoder
                        draggable
                        fitAfterLocationChange
                        location={locationChange || formState.changes?.location}
                        handleChangeAddressMap={handleChangeAddress}
                        maxLimitLocation={maxLimitLocation}
                        saveLocation={saveMapLocation}
                        setSaveLocation={setSaveMapLocation}
                        handleToggleMap={handleToggleMap}
                        setAutoCompleteAddress={setAutoCompleteAddress}
                        autoCompleteAddress={autoCompleteAddress}
                      />
                    </GoogleMapContainer>
                  </View>
                )}

                <View style={{ flexDirection: 'row', flexBasis: '50%' }}>
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
                        ''
                      }
                      render={() => (
                        <OInput
                          name="zipcode"
                          placeholder={t('ZIP_CODE', 'Zip code')}
                          onChange={(data: any) => {
                            handleChangeInput(data);
                            setValue('zipcode', isEmptyField('zipcode', data?.target?.value) ? null : data);
                            setZipcodeValue(data?.target?.value || '');
                          }}
                          value={zipcodeValue}
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
            <OModal
              open={toggleMap}
              onClose={() => handleToggleMap()}
              entireModal
              customClose>
              {(locationChange || formState.changes?.location) && (
                <GoogleMapContainer>
                  <GoogleMap
                    location={locationChange || formState.changes?.location}
                    handleChangeAddressMap={handleChangeAddress}
                    maxLimitLocation={maxLimitLocation}
                    saveLocation={saveMapLocation}
                    setSaveLocation={setSaveMapLocation}
                    handleToggleMap={handleToggleMap}
                    isIntGeoCoder
                  />
                </GoogleMapContainer>
              )}
              <OButton
                text={t('SAVE', 'Save')}
                imgRightSrc={null}
                style={{ marginHorizontal: 30, marginBottom: 10 }}
                onClick={() => setSaveMapLocation(true)}
              />
            </OModal>
            <Spinner visible={saveMapLocation} />
          </AddressFormContainer>
        </TouchableWithoutFeedback>
      </ScrollView>
      {Object.keys(formState?.changes).length > 0 && (
        <FloatingBottomContainer>
          <OButton
            text={
              isEditing ||
                (!auth && orderState.options?.address?.address)
                ? t('UPDATE', 'Update')
                : t('CONTINUE', 'Continue')
            }
            onClick={() => {
              setShowErrors(!showErrors)
              handleSubmit(onSubmit)()
            }}
            isLoading={formState.loading}
            style={{ shadowOpacity: 0 }}
          />
        </FloatingBottomContainer>
      )}
    </>
  );
};

export const AddressForm = (props: AddressFormParams) => {
  const addressFormProps = {
    ...props,
    UIComponent: AddressFormUI,
  };
  return <AddressFormController {...addressFormProps} />;
};
