import React from 'react'
import { useTheme } from 'styled-components/native'

import { LoginWith, OTabs, OTab } from './styles'

import { useLanguage } from '@components'
import { OText } from '@ui'

export const Tabs = (props: any) => {
  const {
    defaultTab,
    isOtpEmail,
    defaultTabs,
    isOtpCellphone,
    useLoginByEmail,
    useLoginByCellphone,
    useOtpEmail,
    useOtpCellphone,
    tabsRef,
    handleChangeTab,
    handleChangeOtpType,
    handleOnLayout
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  const tabs = defaultTabs ?? [
    { tab: 'email', type: 'email', enabled: useLoginByEmail, text: t('LOGIN_FOR_EMAIL', 'For Email') },
    { tab: 'cellphone', type: 'cellphone', enabled: useLoginByCellphone, text: t('LOGIN_FOR_PHONE', 'For Phone') },
    { tab: 'email', type: 'otp_email', enabled: useOtpEmail, text: t('LOGIN_FOR_OTP_EMAIL', 'For OTP Email'), condition: isOtpEmail },
    { tab: 'cellphone', type: 'otp_cellphone', enabled: useOtpCellphone, text: t('LOGIN_FOR_OTP_PHONE', 'For OTP Phone'), condition: isOtpCellphone }
  ]

  return (
    <LoginWith>
      <OTabs
        ref={tabsRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tabs.filter((t: any) => t.enabled).map((tab: any) => {
          const selected = tab?.condition ?? defaultTab === tab.type
          return (
            <OTab
              key={tab.type}
              selected={selected}
              onPress={() => tab.type?.includes?.('otp') && handleChangeOtpType ? handleChangeOtpType(tab.tab) : handleChangeTab(tab.type)}
              onLayout={(event: any) => handleOnLayout && handleOnLayout(event, tab.type)}
            >
              <OText
                color={selected ? theme.colors.white : theme.colors.secondaryLightGray}
                weight={selected ? 'bold' : 'normal'}
              >
                {tab.text}
              </OText>
            </OTab>
          )
        })}
      </OTabs>
    </LoginWith>
  )
}
