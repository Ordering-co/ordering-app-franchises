import React from 'react';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { ORDER_TYPES } from '../config/constants';
import { CODES } from '@components';


export const flatArray = (arr: any) => [].concat(...arr)

/**
 * List of order type
 */
export const orderTypeList = ['delivery', 'pickup', 'eatin', 'curbside', 'drivethru', 'seatdelivery']

/**
 * Function to return the traduction depending of a key 't'
 * @param {string} key for traduction
 * @param translate translate function from useLanguage
 * @param {boolean} useKeyAsFallback when the key is not in keyList, use the key itself as fallback text
 */
export const getTraduction = (key: string, translate: any, useKeyAsFallback = false) => {
  const keyList: any = {
    // Add the key and traduction that you need below
    ERROR_ORDER_WITHOUT_CART: 'The order was placed without a cart',
    ERROR_INVALID_COUPON: "The coupon doesn't exist",
    ERROR_IVALID_COUPON_MINIMUM: 'You must have more products in your cart to use the coupon',
    ERROR_ADD_PRODUCT_VERY_FAR_FOR_PICKUP: 'The business is too far for order type pickup',
    ERROR_PLACE_PAY_WITH_CARD2: 'An error occurred while trying to pay by card',
    ERROR_ADD_PRODUCT_BUSINESS_CLOSED: 'The business is closed at the moment',
    INTERNAL_ERROR: 'Server Error, please wait, we are working to fix it',
    ERROR_NOT_FOUND_BUSINESSES: 'No businesses found near your location',
    YOU_DO_NOT_HAVE_PERMISSION: 'You do not have permission',
    INVALID_CODE: 'Invalid verify code',
    STRIPE_ERROR: 'Payment service error. Try again later.',
    ERROR_AUTH_TWILIO_DISABLED: 'Auth error, twilio is disabled',
    ERROR_CART_SELECT_PAYMETHOD: 'An error occurred with selected pay method',
    ERROR_YOU_HAVE_ACTIVE_CART: 'You can\'t reorder this cart',
    ERROR_YOU_HAVE_NOT_CART: 'Cart not found',
    ERROR_PLACE_PAY_WITH_REDIRECT: 'An error occurred while trying to pay by redirect',
    ERROR_PLACE_PAY_WITH_CARD1: 'An error occurred while trying to pay by card',
    ERROR_PLACE_PAY_WITH_PAYPAL_CAPTURE: 'An error occurred while trying to pay by PayPal',
    ERROR_ADD_PRODUCT_VERY_FAR_FOR_DELIVERY: 'Error adding product, very far for delivery',
    ERROR_PRODUCT_NOT_FOUND: 'Error with the product',
    ERROR_ADD_BUSINESS_INVALID: 'An error occurred with the business',
    ERROR_INVALID_OFFER: 'The offer doesn\'t exist',
    ERROR_ADD_PRODUCT_BEFORE_ADDRESS: 'You must have an address'
  }

  if (keyList[key]) return translate(key, keyList[key])
  return useKeyAsFallback ? translate(key, key) : translate(key)
}

export const localeValues = (translate: any) => ({
  months: [
    translate('MONTH1', 'January'),
    translate('MONTH2', 'February'),
    translate('MONTH3', 'March'),
    translate('MONTH4', 'April'),
    translate('MONTH5', 'May'),
    translate('MONTH6', 'June'),
    translate('MONTH7', 'July'),
    translate('MONTH8', 'August'),
    translate('MONTH9', 'September'),
    translate('MONTH10', 'October'),
    translate('MONTH11', 'November'),
    translate('MONTH12', 'December')
  ],
  monthsShort: [
    translate('MONTHSHORT1', 'Jan'),
    translate('MONTHSHORT2', 'Feb'),
    translate('MONTHSHORT3', 'Mar'),
    translate('MONTHSHORT4', 'Apr'),
    translate('MONTHSHORT5', 'May'),
    translate('MONTHSHORT6', 'Jun'),
    translate('MONTHSHORT7', 'Jul'),
    translate('MONTHSHORT8', 'Aug'),
    translate('MONTHSHORT9', 'Sep'),
    translate('MONTHSHORT10', 'Oct'),
    translate('MONTHSHORT11', 'Nov'),
    translate('MONTHSHORT12', 'Dec')
  ],
  weekdays: [
    translate('DAY7', 'Sunday'),
    translate('DAY1', 'Monday'),
    translate('DAY2', 'Tuesday'),
    translate('DAY3', 'Wednesday'),
    translate('DAY4', 'Thursday'),
    translate('DAY5', 'Friday'),
    translate('DAY6', 'Saturday')
  ],
  weekdaysShort: [
    translate('DAYSHORT7', 'Sun'),
    translate('DAYSHORT1', 'Mon'),
    translate('DAYSHORT2', 'Tue'),
    translate('DAYSHORT3', 'Wed'),
    translate('DAYSHORT4', 'Thu'),
    translate('DAYSHORT5', 'Fri'),
    translate('DAYSHORT6', 'Sat')
  ],
  weekdaysMin: [
    translate('DAYMIN7', 'Su'),
    translate('DAYMIN1', 'Mo'),
    translate('DAYMIN2', 'Tu'),
    translate('DAYMIN3', 'We'),
    translate('DAYMIN4', 'Th'),
    translate('DAYMIN5', 'Fr'),
    translate('DAYMIN6', 'Sa')
  ],
  meridiem: function (hours: any) {
    return hours < 12 ? translate('AM', 'AM') : translate('PM', 'PM');
  }
})

/**
 * Change local moment variables
 */
export const setLocalMoment = (moment: any, translate: any) => {
  moment.locale('custom', localeValues(translate))
}

export const monthsEnum: any = {
  Jan: 'MONTHSHORT1',
  Feb: 'MONTHSHORT2',
  Mar: 'MONTHSHORT3',
  Apr: 'MONTHSHORT4',
  May: 'MONTHSHORT5',
  Jun: 'MONTHSHORT6',
  Jul: 'MONTHSHORT7',
  Aug: 'MONTHSHORT8',
  Sep: 'MONTHSHORT9',
  Oct: 'MONTHSHORT10',
  Nov: 'MONTHSHORT11',
  Dec: 'MONTHSHORT12',
}

/**
 * Function to convert delivery time in minutes
 * @param {string} time business delivery time
 */
export const convertHoursToMinutes = (time: any) => {
  if (!time) return '0min'
  const [hour, minute] = time.split(':')
  const result = (parseInt(hour, 10) * 60) + parseInt(minute, 10)
  return `${result}min`
}

export const getIconCard = (brand: string, size: number) => {
  const icons: { [key: string]: string } = {
    'visa': 'cc-visa',
    'mastercard': 'cc-mastercard',
    'amex': 'cc-amex',
    'discover': 'cc-discover',
    'jcb': 'cc-jcb',
    'diners-club': 'cc-diners-club',
    'default': 'credit-card-alt'
  }

  const iconName = icons?.[brand?.toLowerCase()] || icons.default

  return (
    <FontAwesome
      name={iconName}
      size={size}
      color={'#000'}
    />
  );
}
/**
 * Function to return a static google maps image based in location
 * @param {object} param object with latitude and logitude
 */
export const getGoogleMapImage = ({ lat, lng }: any, apiKey: string) => {
  return `https://maps.googleapis.com/maps/api/staticmap?size=500x190&center=${lat},${lng}&zoom=17&scale=2&maptype=roadmap&&markers=icon:https://res.cloudinary.com/ditpjbrmz/image/upload/f_auto,q_auto,w_45,q_auto:best,q_auto:best/v1564675872/marker-customer_kvxric.png%7Ccolor:white%7C${lat},${lng}&key=${apiKey}`
}
/**
 * List of fields with correct order
 */
export const fieldsToSort = ['name', 'middle_name', 'lastname', 'second_lastname', 'email'];
/**
 * Function to return a array sorted by certain fields
 * @param fields Array with right order
 * @param array Array to sort
 */
export const sortInputFields = ({ fields, values }: any) => {
  let fieldsBase = fields;
  const fieldsSorted: any = [];
  const fieldsArray = Array.isArray(values) ? values : values && Object.values(values);

  if (!fieldsBase) {
    fieldsBase = fieldsToSort
  }

  fieldsBase.forEach((f: any) => {
    fieldsArray && fieldsArray.forEach((field: any) => {
      if (f === (field.validation_field?.code || field?.code)) {
        fieldsSorted.push(field)
      }
    })
  });
  return fieldsSorted;
}

export const transformCountryCode = (countryCode: string) => {
  let _countryCode = countryCode
  if (countryCode.includes('+')) {
    _countryCode = countryCode.replace('+', '')
  }
  const code = CODES.find((code: any) => code.phoneCode === _countryCode)
  return code?.countryCode
}

export const findExitingCode = (countryCode: string) => {
  const code = CODES.find((code: any) => code.countryCode === (countryCode || '').toUpperCase())
  return code?.countryCode
}

/**
 * Function to check if a number is decimal or not
 * @param {*} value number to check if decimal or not
 * @param {*} parser function fallback when is decimal
 * @returns string
 */
export const verifyDecimals = (value: number, parser: any) => {
  if (value % 1 === 0) {
    return value
  } else {
    return parser(value)
  }
}

export const getTypesText = (value: number) => {
  const ret = ORDER_TYPES.find((type: any) => type.value == value);
  return ret?.content;
}

/**
 * List shape for ribbon
 */
export const shape = {
  rectangle: 'rectangle',
  rectangleRound: 'rectangle_round',
  capsuleShape: 'capsule_shape'
}

/**
 * Function to transform degree to radian
 * @param {number} value for transform
 *
 */
export const convertToRadian = (value: number) => {
  return value * Math.PI / 180
}

/**
 * Function to distance between two locations
 * @param lat1 Lat for first location
 * @param lon1 Lon for first location
 * @param lat2 Lat for second location
 * @param lon2 Lon for second location
 */
export const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
  const R = 6371 // km
  const dLat = convertToRadian(lat2 - lat1)
  const dLon = convertToRadian(lon2 - lon1)
  const curLat1 = convertToRadian(lat1)
  const curLat2 = convertToRadian(lat2)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(curLat1) * Math.cos(curLat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const formatUrlVideo = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const id = (match && match[7].length === 11) ? match[7] : false
  return `https://www.youtube-nocookie.com/embed/${id}`
}

export const formatSeconds = (seconds: number) => {
  // Hours, minutes and seconds
  var hrs = ~~(seconds / 3600)
  var mins = ~~((seconds % 3600) / 60)
  var secs = ~~seconds % 60

  // Output like '1:01' or '4:03:59' or '123:03:59'
  var ret = ''
  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }
  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs
  return ret
}

/**
 * List of price to filter businesses
 */
export const priceList = [
  { level: '1', content: '$' },
  { level: '2', content: '$$' },
  { level: '3', content: '$$$' },
  { level: '4', content: '$$$$' },
  { level: '5', content: '$$$$$' }
]

export const getLogisticTag = (status: any, translate: any) => {
  const keyList: any = {
    0: translate('PENDING', 'Pending'),
    1: translate('IN_PROGRESS', 'In progress'),
    2: translate('IN_QUEUE', 'In queue'),
    3: translate('EXPIRED', 'Expired'),
    4: translate('RESOLVED', 'Resolved'),
  }
  return keyList[status] ? keyList[status] : translate('UNKNOWN', 'Unknown')
}

export const getOrderStatus = (s: string, translate: any, theme: any) => {
  const status = parseInt(s);
  const orderStatus = [
    {
      key: 0,
      value: translate('PENDING', 'Pending'),
      slug: 'PENDING',
      percentage: 0.1,
      image: theme.images.order.status0,
    },
    {
      key: 1,
      value: translate('COMPLETED', 'Completed'),
      slug: 'COMPLETED',
      percentage: 1,
      image: theme.images.order.status1,
    },
    {
      key: 2,
      value: translate('REJECTED', 'Rejected'),
      slug: 'REJECTED',
      percentage: 0,
      image: theme.images.order.status2,
    },
    {
      key: 3,
      value: translate('DRIVER_IN_BUSINESS', 'Driver in business'),
      slug: 'DRIVER_IN_BUSINESS',
      percentage: 0.6,
      image: theme.images.order.status3,
    },
    {
      key: 4,
      value: translate('PREPARATION_COMPLETED', 'Preparation Completed'),
      slug: 'PREPARATION_COMPLETED',
      percentage: 0.2,
      image: theme.images.order.status4,
    },
    {
      key: 5,
      value: translate('REJECTED_BY_BUSINESS', 'Rejected by business'),
      slug: 'REJECTED_BY_BUSINESS',
      percentage: 0,
      image: theme.images.order.status5,
    },
    {
      key: 6,
      value: translate('REJECTED_BY_DRIVER', 'Rejected by Driver'),
      slug: 'REJECTED_BY_DRIVER',
      percentage: 0,
      image: theme.images.order.status6,
    },
    {
      key: 7,
      value: translate('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
      slug: 'ACCEPTED_BY_BUSINESS',
      percentage: 0.15,
      image: theme.images.order.status7,
    },
    {
      key: 8,
      value: translate('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
      slug: 'ACCEPTED_BY_DRIVER',
      percentage: 0.4,
      image: theme.images.order.status8,
    },
    {
      key: 9,
      value: translate('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
      slug: 'PICK_UP_COMPLETED_BY_DRIVER',
      percentage: 0.7,
      image: theme.images.order.status9,
    },
    {
      key: 10,
      value: translate('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
      slug: 'PICK_UP_FAILED_BY_DRIVER',
      percentage: 0,
      image: theme.images.order.status10,
    },
    {
      key: 11,
      value: translate(
        'DELIVERY_COMPLETED_BY_DRIVER',
        'Delivery completed by driver',
      ),
      slug: 'DELIVERY_COMPLETED_BY_DRIVER',
      percentage: 1,
      image: theme.images.order.status11,
    },
    {
      key: 12,
      value: translate('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
      slug: 'DELIVERY_FAILED_BY_DRIVER',
      percentage: 0,
      image: theme.images.order.status12,
    },
    {
      key: 13,
      value: translate('PREORDER', 'PreOrder'),
      slug: 'PREORDER',
      percentage: 0,
      image: theme.images.order.status13,
    },
    {
      key: 14,
      value: translate('ORDER_NOT_READY', 'Order not ready'),
      slug: 'ORDER_NOT_READY',
      percentage: 0.15,
      image: theme.images.order.status13,
    },
    {
      key: 15,
      value: translate(
        'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        'Order picked up completed by customer',
      ),
      slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
      percentage: 1,
      image: theme.images.order.status1,
    },
    {
      key: 16,
      value: translate('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
      slug: 'CANCELLED_BY_CUSTOMER',
      percentage: 0,
      image: theme.images.order.status2,
    },
    {
      key: 17,
      value: translate(
        'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        'Order not picked up by customer',
      ),
      slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
      percentage: 0,
      image: theme.images.order.status2,
    },
    {
      key: 18,
      value: translate(
        'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
        'Driver almost arrived to business',
      ),
      slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
      percentage: 0.5,
      image: theme.images.order.status3,
    },
    {
      key: 19,
      value: translate(
        'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
        'Driver almost arrived to customer',
      ),
      slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
      percentage: 0.9,
      image: theme.images.order.status11,
    },
    {
      key: 20,
      value: translate(
        'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        'Customer almost arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
      percentage: 0.9,
      image: theme.images.order.status7,
    },
    {
      key: 21,
      value: translate(
        'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        'Customer arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
      percentage: 0.9,
      image: theme.images.order.status7,
    },
    {
      key: 22,
      value: translate('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver'),
      slug: 'ORDER_LOOKING_FOR_DRIVER',
      percentage: 0.3,
      image: theme.images.order.status8
    },
    {
      key: 23,
      value: translate('ORDER_DRIVER_ON_WAY', 'Driver on way'),
      slug: 'ORDER_DRIVER_ON_WAY',
      percentage: 0.8,
      image: theme.images.order.status8
    },
    {
      key: 24,
      value: translate('ORDER_DRIVER_WAITING_FOR_ORDER', 'Driver waiting for order'),
      slug: 'ORDER_DRIVER_WAITING_FOR_ORDER',
      percentage: 0.25
    },
    {
      key: 25,
      value: translate('ORDER_ACCEPTED_BY_DRIVER_COMPANY', 'Accepted by driver company'),
      slug: 'ORDER_ACCEPTED_BY_DRIVER_COMPANY',
      percentage: 0.25
    },
    {
      key: 26,
      value: translate('ORDER_DRIVER_ARRIVED_CUSTOMER', 'Driver arrived to customer'),
      slug: 'ORDER_DRIVER_ARRIVED_CUSTOMER',
      percentage: 0.8
    }
  ];

  const objectStatus = orderStatus.find((o) => o.key === status);

  return objectStatus && objectStatus;
}

export const getOrderStatuPickUp = (s: any, translate: any, theme: any) => {
  const status = parseInt(s);
  const orderStatus = [
    {
      key: 0,
      value: translate('PENDING', 'Pending'),
      slug: 'PENDING',
      percentage: 0.1,
      image: theme.images.order.status0,
    },
    {
      key: 1,
      value: translate('COMPLETED', 'Completed'),
      slug: 'COMPLETED',
      percentage: 1,
      image: theme.images.order.status1,
    },
    {
      key: 2,
      value: translate('REJECTED', 'Rejected'),
      slug: 'REJECTED',
      percentage: 0,
      image: theme.images.order.status2,
    },
    {
      key: 4,
      value: translate('PREPARATION_COMPLETED', 'Preparation Completed'),
      slug: 'PREPARATION_COMPLETED',
      percentage: 0.5,
      image: theme.images.order.status4,
    },
    {
      key: 5,
      value: translate('REJECTED_BY_BUSINESS', 'Rejected by business'),
      slug: 'REJECTED_BY_BUSINESS',
      percentage: 0,
      image: theme.images.order.status5,
    },
    {
      key: 7,
      value: translate('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
      slug: 'ACCEPTED_BY_BUSINESS',
      percentage: 0.3,
      image: theme.images.order.status7,
    },
    {
      key: 13,
      value: translate('PREORDER', 'PreOrder'),
      slug: 'PREORDER',
      percentage: 0,
      image: theme.images.order.status13,
    },
    {
      key: 14,
      value: translate('ORDER_NOT_READY', 'Order not ready'),
      slug: 'ORDER_NOT_READY',
      percentage: 0.3,
      image: theme.images.order.status13,
    },
    {
      key: 15,
      value: translate(
        'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        'Order picked up completed by customer',
      ),
      slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
      percentage: 1,
      image: theme.images.order.status1,
    },
    {
      key: 16,
      value: translate('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
      slug: 'CANCELLED_BY_CUSTOMER',
      percentage: 0,
      image: theme.images.order.status2,
    },
    {
      key: 17,
      value: translate(
        'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        'Order not picked up by customer',
      ),
      slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
      percentage: 0,
      image: theme.images.order.status2,
    },
    {
      key: 20,
      value: translate(
        'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        'Customer almost arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
      percentage: 0.7,
      image: theme.images.order.status7,
    },
    {
      key: 21,
      value: translate(
        'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        'Customer arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
      percentage: 0.9,
      image: theme.images.order.status7,
    }
  ];

  const objectStatus = orderStatus.find((o) => o.key === status);

  return objectStatus && objectStatus;
}

/**
 * Function to get brightness of color.
 */
export const lightenDarkenColor = (color: any) => {

  let r, g, b, hsp
  if (!color) return
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)

    r = color[1]
    g = color[2]
    b = color[3]
  } else {
    // If RGB --> Convert it to HEX
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))

    r = color >> 16
    g = color >> 8 & 255
    b = color & 255
  }

  // HSP (Highly Sensitive Poo) equation
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  )

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 197) {
    return true //is light color
  } else {
    return false
  }
}

/**
 * function to manage review comment list
 * @param {number} param0 type of reviews to return
 * @returns object with reviews dictionary
 */
export const reviewCommentList = (type: string, translate: any) => {
  // TODO: improve this function
  const reviews: any = {
    order: {
      1: {
        title: translate('QUICK_COMMENT_TITLE_1', "What went wrong?"),
        list: [
          { key: 0, content: translate('QUICK_COMMENT_1_0', "Not handled with care") },
          { key: 1, content: translate('QUICK_COMMENT_1_1', "Poor communication") },
          { key: 2, content: translate('QUICK_COMMENT_1_2', "COVID-19 issue") },
          { key: 3, content: translate('QUICK_COMMENT_1_3', "Didn't follow instructions") },
          { key: 4, content: translate('QUICK_COMMENT_1_4', "Rude") },
          { key: 5, content: translate('QUICK_COMMENT_1_5', "Not on-time") },
        ]
      },
      2: {
        title: translate('QUICK_COMMENT_TITLE_2', "What went wrong?"),
        list: [
          { key: 0, content: translate('QUICK_COMMENT_2_0', "Not handled with care") },
          { key: 1, content: translate('QUICK_COMMENT_2_1', "Poor communication") },
          { key: 2, content: translate('QUICK_COMMENT_2_2', "COVID-19 issue") },
          { key: 3, content: translate('QUICK_COMMENT_2_3', "Didn't follow instructions") },
          { key: 4, content: translate('QUICK_COMMENT_2_4', "Rude") },
          { key: 5, content: translate('QUICK_COMMENT_2_5', "Not on-time") },
        ]
      },
      3: {
        title: translate('QUICK_COMMENT_TITLE_3', "What could have been better?"),
        list: [
          { key: 0, content: translate('QUICK_COMMENT_3_0', "Not handled with care") },
          { key: 1, content: translate('QUICK_COMMENT_3_1', "Poor communication") },
          { key: 2, content: translate('QUICK_COMMENT_3_2', "COVID-19 issue") },
          { key: 3, content: translate('QUICK_COMMENT_3_3', "Didn't follow instructions") },
          { key: 4, content: translate('QUICK_COMMENT_3_4', "Rude") },
          { key: 5, content: translate('QUICK_COMMENT_3_5', "Not on-time") },
        ]
      },
      4: {
        title: translate('QUICK_COMMENT_TITLE_4', " Tell us more"),
        list: [
          { key: 0, content: translate('QUICK_COMMENT_4_0', "Not handled with care") },
          { key: 1, content: translate('QUICK_COMMENT_4_1', "Poor communication") },
          { key: 2, content: translate('QUICK_COMMENT_4_2', "COVID-19 issue") },
          { key: 3, content: translate('QUICK_COMMENT_4_3', "Didn't follow instructions") },
          { key: 4, content: translate('QUICK_COMMENT_4_4', "Rude") },
          { key: 5, content: translate('QUICK_COMMENT_4_5', "Not on-time") },
        ]
      },
      5: {
        title: translate('QUICK_COMMENT_TITLE_5', "What went well?"),
        list: [
          { key: 0, content: translate('QUICK_COMMENT_5_0', "Good communication") },
          { key: 1, content: translate('QUICK_COMMENT_5_1', "Followed instructions") },
          { key: 2, content: translate('QUICK_COMMENT_5_2', "Friendly") },
          { key: 3, content: translate('QUICK_COMMENT_5_3', 'Handled with care') },
          { key: 4, content: translate('QUICK_COMMENT_5_4', "Above and beyond") },
        ]
      },
    },
    customer: {
      1: {
        title: translate('CUSTOMER_QUICK_COMMENT_TITLE_1', "What went wrong?"),
        list: [
          { key: 0, content: translate('CUSTOMER_QUICK_COMMENT_1_0', "Poor communication") },
          { key: 1, content: translate('CUSTOMER_QUICK_COMMENT_1_1', "Wrong address") },
          { key: 2, content: translate('CUSTOMER_QUICK_COMMENT_1_2', "COVID-19 issue") },
          { key: 3, content: translate('CUSTOMER_QUICK_COMMENT_1_3', "Didn't follow instructions") },
          { key: 4, content: translate('CUSTOMER_QUICK_COMMENT_1_4', "Rude") },
          { key: 5, content: translate('CUSTOMER_QUICK_COMMENT_1_5', "Not on-time") },
        ]
      },
      2: {
        title: translate('CUSTOMER_QUICK_COMMENT_TITLE_2', "What went wrong?"),
        list: [
          { key: 0, content: translate('CUSTOMER_QUICK_COMMENT_2_0', "Poor communication") },
          { key: 1, content: translate('CUSTOMER_QUICK_COMMENT_2_1', "Wrong address") },
          { key: 2, content: translate('CUSTOMER_QUICK_COMMENT_2_2', "COVID-19 issue") },
          { key: 3, content: translate('CUSTOMER_QUICK_COMMENT_2_3', "Didn't follow instructions") },
          { key: 4, content: translate('CUSTOMER_QUICK_COMMENT_2_4', "Rude") },
          { key: 5, content: translate('CUSTOMER_QUICK_COMMENT_2_5', "Not on-time") },
        ]
      },
      3: {
        title: translate('CUSTOMER_QUICK_COMMENT_TITLE_3', "What could have been better?"),
        list: [
          { key: 0, content: translate('CUSTOMER_QUICK_COMMENT_3_0', "Poor communication") },
          { key: 1, content: translate('CUSTOMER_QUICK_COMMENT_3_1', "Wrong address") },
          { key: 2, content: translate('CUSTOMER_QUICK_COMMENT_3_2', "COVID-19 issue") },
          { key: 3, content: translate('CUSTOMER_QUICK_COMMENT_3_3', "Didn't follow instructions") },
          { key: 4, content: translate('CUSTOMER_QUICK_COMMENT_3_4', "Rude") },
          { key: 5, content: translate('CUSTOMER_QUICK_COMMENT_3_5', "Not on-time") },
        ]
      },
      4: {
        title: translate('CUSTOMER_QUICK_COMMENT_TITLE_4', " Tell us more"),
        list: [
          { key: 0, content: translate('CUSTOMER_QUICK_COMMENT_4_0', "Poor communication") },
          { key: 1, content: translate('CUSTOMER_QUICK_COMMENT_4_1', "Wrong address") },
          { key: 2, content: translate('CUSTOMER_QUICK_COMMENT_4_2', "COVID-19 issue") },
          { key: 3, content: translate('CUSTOMER_QUICK_COMMENT_4_3', "Didn't follow instructions") },
          { key: 4, content: translate('CUSTOMER_QUICK_COMMENT_4_4', "Rude") },
          { key: 5, content: translate('CUSTOMER_QUICK_COMMENT_4_5', "Not on-time") },
        ]
      },
      5: {
        title: translate('CUSTOMER_QUICK_COMMENT_TITLE_5', "What went well?"),
        list: [
          { key: 0, content: translate('CUSTOMER_QUICK_COMMENT_5_0', "Good communication") },
          { key: 1, content: translate('CUSTOMER_QUICK_COMMENT_5_1', "Friendly") },
          { key: 2, content: translate('CUSTOMER_QUICK_COMMENT_5_2', "Above and beyond") },
        ]
      },
    },
    driver: {
      1: {
        title: translate('DRIVER_QUICK_COMMENT_TITLE_1', "What went wrong?"),
        list: [
          { key: 0, content: translate('DRIVER_QUICK_COMMENT_1_0', "Not handled with care") },
          { key: 1, content: translate('DRIVER_QUICK_COMMENT_1_1', "Poor communication") },
          { key: 2, content: translate('DRIVER_QUICK_COMMENT_1_2', "COVID-19 issue") },
          { key: 3, content: translate('DRIVER_QUICK_COMMENT_1_3', "Didn't follow instructions") },
          { key: 4, content: translate('DRIVER_QUICK_COMMENT_1_4', "Rude") },
          { key: 5, content: translate('DRIVER_QUICK_COMMENT_1_5', "Not on-time") },
        ]
      },
      2: {
        title: translate('DRIVER_QUICK_COMMENT_TITLE_2', "What went wrong?"),
        list: [
          { key: 0, content: translate('DRIVER_QUICK_COMMENT_2_0', "Not handled with care") },
          { key: 1, content: translate('DRIVER_QUICK_COMMENT_2_1', "Poor communication") },
          { key: 2, content: translate('DRIVER_QUICK_COMMENT_2_2', "COVID-19 issue") },
          { key: 3, content: translate('DRIVER_QUICK_COMMENT_2_3', "Didn't follow instructions") },
          { key: 4, content: translate('DRIVER_QUICK_COMMENT_2_4', "Rude") },
          { key: 5, content: translate('DRIVER_QUICK_COMMENT_2_5', "Not on-time") },
        ]
      },
      3: {
        title: translate('DRIVER_QUICK_COMMENT_TITLE_3', "What could have been better?"),
        list: [
          { key: 0, content: translate('DRIVER_QUICK_COMMENT_3_0', "Not handled with care") },
          { key: 1, content: translate('DRIVER_QUICK_COMMENT_3_1', "Poor communication") },
          { key: 2, content: translate('DRIVER_QUICK_COMMENT_3_2', "COVID-19 issue") },
          { key: 3, content: translate('DRIVER_QUICK_COMMENT_3_3', "Didn't follow instructions") },
          { key: 4, content: translate('DRIVER_QUICK_COMMENT_3_4', "Rude") },
          { key: 5, content: translate('DRIVER_QUICK_COMMENT_3_5', "Not on-time") },
        ]
      },
      4: {
        title: translate('DRIVER_QUICK_COMMENT_TITLE_4', " Tell us more"),
        list: [
          { key: 0, content: translate('DRIVER_QUICK_COMMENT_4_0', "Not handled with care") },
          { key: 1, content: translate('DRIVER_QUICK_COMMENT_4_1', "Poor communication") },
          { key: 2, content: translate('DRIVER_QUICK_COMMENT_4_2', "COVID-19 issue") },
          { key: 3, content: translate('DRIVER_QUICK_COMMENT_4_3', "Didn't follow instructions") },
          { key: 4, content: translate('DRIVER_QUICK_COMMENT_4_4', "Rude") },
          { key: 5, content: translate('DRIVER_QUICK_COMMENT_4_5', "Not on-time") },
        ]
      },
      5: {
        title: translate('DRIVER_QUICK_COMMENT_TITLE_5', "What went well?"),
        list: [
          { key: 0, content: translate('DRIVER_QUICK_COMMENT_5_0', "Good communication") },
          { key: 1, content: translate('DRIVER_QUICK_COMMENT_5_1', "Followed instructions") },
          { key: 2, content: translate('DRIVER_QUICK_COMMENT_5_2', "Friendly") },
          { key: 3, content: translate('DRIVER_QUICK_COMMENT_5_3', 'Handled with care') },
          { key: 4, content: translate('DRIVER_QUICK_COMMENT_5_4', "Above and beyond") },
        ]
      },
    },
    product: {
      like: [
        { key: 0, content: translate('QUICK_COMMENT_LIKE_0', "Tasty") },
        { key: 1, content: translate('QUICK_COMMENT_LIKE_1', "Good price") },
        { key: 2, content: translate('QUICK_COMMENT_LIKE_2', "Good portion size") },
        { key: 3, content: translate('QUICK_COMMENT_LIKE_3', "Packed well") },
      ],
      dislike: [
        { key: 0, content: translate('QUICK_COMMENT_DISLIKE_0', "Not tasty") },
        { key: 1, content: translate('QUICK_COMMENT_DISLIKE_1', "High price") },
        { key: 2, content: translate('QUICK_COMMENT_DISLIKE_2', "Bad portion size") },
        { key: 3, content: translate('QUICK_COMMENT_DISLIKE_3', "Not packed well") },
      ]
    }
  }

  return reviews[type]
}

export const vibrateApp = (impact?: any) => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
  };
  ReactNativeHapticFeedback.trigger(impact || "impactLight", options);
}

export const getPayIcon = (method: string, theme: any) => {
  const payIcons: any = {
    cash: theme.images.general.cash,
    card_delivery: theme.images.general.carddelivery,
    paypal: theme.images.general.paypal,
    stripe: theme.images.general.stripe,
    stripe_direct: theme.images.general.stripecc,
    stripe_checkout: theme.images.general.stripecheckout,
    stripe_connect: theme.images.general.stripes,
    stripe_redirect: theme.images.general.stripesb,
    apple_pay: theme.images.general.applePayMark,
    google_pay: theme.images.general.googlePayMark,
    credomatic: theme.images.general.credomatic
  }

  return payIcons[method] || theme.images.general.creditCard
}

export const currencyWithoutDecimals = [
  'BIF',
  'CLP',
  'DJF',
  'GNF',
  'JPY',
  'KMF',
  'KRW',
  'MGA',
  'PYG',
  'RWF',
  'UGX',
  'VND',
  'VUV',
  'XAF',
  'XOF',
  'XPF'
]

export const chatLanguagesAvailable = (lang: string) => {
  // To add a new language, follow these steps:
  // 1. Insert the language code into the array `langAllowed`.
  // 2. Add the corresponding import statement `import 'dayjs/locale/{lang}'` to the file `src/ui/src/components/Messages/index.tsx`.
  const langAllowed = ['es']

  return langAllowed.includes(lang) ? lang : 'en'
}
