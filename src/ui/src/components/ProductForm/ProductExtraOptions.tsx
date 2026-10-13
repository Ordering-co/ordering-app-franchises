import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'styled-components/native'

import { ExtraOptionItem, ExtraOptionWrap } from './styles'
import { useLanguage } from '@components'
import { OText } from '@ui'

export const ProductExtraOptions = (props: any) => {
  const {
    extras,
    ingredients,
    selOpt,
    optionsLength,
    scrollViewRef,
    optionLayout,
    editionsLayoutY,
    MAX_AUTO_SCROLL_PRODUCT_SUBOPTIONS,
    setSelectedOpt
  } = props

  const tabsRef = useRef<any>(null)
  const theme = useTheme()
  const [, t] = useLanguage()

  const [tabLayouts, setTabLayouts] = useState<any>({})

  const handleCategoryScroll = (id: any) => {
    setSelectedOpt(id ? `cat_${id}` : -1)
    scrollViewRef?.current?.scrollTo && scrollViewRef.current.scrollTo({
      y: optionLayout[id ? `cat_${id}` : 'cat_01']?.y + editionsLayoutY - 50,
      animated: true
    })
  }

  const handleOnLayout = (event: any, id: any) => {
    if (optionsLength > MAX_AUTO_SCROLL_PRODUCT_SUBOPTIONS) return
    const _tabLayouts = { ...tabLayouts }
    const optionId = 'cat_' + (id || '01')
    _tabLayouts[optionId] = event.nativeEvent.layout
    setTabLayouts(_tabLayouts)
  }

  useEffect(() => {
    if (!selOpt || Object.keys(tabLayouts).length === 0) return

    tabsRef.current.scrollTo({
      x: tabLayouts[selOpt]?.x - 40,
      animated: true
    })
  }, [selOpt, tabLayouts])

  return (
    <ExtraOptionWrap
      ref={tabsRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      {ingredients?.length > 0 && (
        <ExtraOptionItem
          key='cat_01'
          selected={selOpt === -1}
          onPress={() => requestAnimationFrame(() => handleCategoryScroll(''))}
          onLayout={(event: any) => handleOnLayout(event, '')}
        >
          <OText
            color={selOpt === -1 ? theme.colors.white : theme.colors.disabled}
            size={12}
            weight={selOpt === -1 ? '600' : 'normal'}>
            {t('INGREDIENTS', 'Ingredients')}
          </OText>
        </ExtraOptionItem>
      )}
      {extras.map((extra: any, idx: number) => (
        <React.Fragment key={extra?.id + idx}>
          {extra.options.map(({ id, name, respect_to, suboptions }: any) => (
            <React.Fragment key={`cont_key_${id}`}>
              {respect_to == null && suboptions?.length > 0 && (
                <ExtraOptionItem
                  key={id}
                  selected={selOpt === `cat_${id}`}
                  onPress={() => requestAnimationFrame(() => handleCategoryScroll(id))}
                  onLayout={(event: any) => handleOnLayout(event, id)}
                >
                  <OText
                    color={selOpt === `cat_${id}` ? theme.colors.white : theme.colors.disabled}
                    weight={selOpt === `cat_${id}` ? '600' : 'normal'}
                    style={{ maxWidth: 150 }}
                    numberOfLines={1}
                  >
                    {name}
                  </OText>
                </ExtraOptionItem>
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </ExtraOptionWrap>
  )
}
