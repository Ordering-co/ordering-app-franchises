import React from 'react'
import moment from 'moment'
import { useTheme } from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { WraperOptions, WrapperAddress } from './styles'

import { useOrder, useLanguage, useUtils, useConfig } from '@components'
import { OText, ORDER_TYPES, OIcon } from '@ui'

export const AddressComponent = (props: any) => {
  const { type, onRedirect, business } = props

  const [{ parseDate }] = useUtils()
  const [{ configs }] = useConfig()
  const [{ options }] = useOrder()
  const [, t] = useLanguage()
  const theme = useTheme()

  const isPreOrder = configs?.preorder_status_enabled?.value === '1'

  return (
    <WrapperAddress>
      <WraperOptions>
        <OText
          weight={'bold'}
          size={theme.utils.tsize.m}
          color={theme.colors.textNormal}
        >
          {type === 'moment'
            ? options?.moment
              ? parseDate(options?.moment, { outputFormat: configs?.dates_moment_format?.value })
              : (`${t('ASAP', 'ASAP')} ${t('TODAY_AT', 'Today at')} (${moment(new Date()).format(configs?.general_hour_format?.value)})`)
            : t(ORDER_TYPES[options?.type - 1]?.content)}
        </OText>
        {type !== 'moment' && (
          <OText
            size={theme.utils.tsize.s}
            color={theme.colors.textNormal}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {options?.address?.address}
          </OText>
        )}
      </WraperOptions>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onRedirect(type === 'moment' ? 'MomentOption' : 'AddressList', {
          business: business
        })}
      >
        {type === 'moment' ? (
          <>
            {isPreOrder && (
              <OText
                color={theme.colors.primary}
                style={{ textDecorationLine: 'underline', textAlign: 'right' }}
              >
                {t('CHANGE', 'change')}
              </OText>
            )}
          </>
        ) : (
          <OIcon
            width={20}
            src={theme.images.general.pencil}
          />
        )}
      </TouchableOpacity>
    </WrapperAddress>
  )
}
