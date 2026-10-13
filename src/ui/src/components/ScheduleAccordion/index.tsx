import React, { useState } from 'react'
import { Platform, View } from 'react-native'
import { useTheme } from 'styled-components/native';

import {
  Accordion,
  AccordionSection,
  DropdownWrapper,
} from './styles'
import { useLanguage } from '@components';
import { OIcon, OText } from '../shared';

export const ScheduleAccordion = (props: any) => {
  const {
    timeFormated,
    schedule,
    weekIndex
  } = props

  const [isActive, setActiveState] = useState(false)
  const [, t] = useLanguage()
  const theme = useTheme();

  const daysOfWeek = [
    t('DAY7', 'Sunday'),
    t('DAY1', 'Monday'),
    t('DAY2', 'Tuesday'),
    t('DAY3', 'Wednesday'),
    t('DAY4', 'Thursday'),
    t('DAY5', 'Friday'),
    t('DAY6', 'Saturday'),
  ];

  return (
    <AccordionSection>
      <Accordion
        onPress={() => setActiveState(!isActive)}
        activeOpacity={1}
      >
        <DropdownWrapper>
          <OText
            lineHeight={21}
            weight={Platform.OS === 'android' ? 'bold' : '400'}
          >
            {daysOfWeek[weekIndex]}
          </OText>
        </DropdownWrapper>
        <View>
          {schedule?.lapses?.map((lapse: any, index: number) => (
            schedule?.enabled ?
              <View
                key={index}
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <OText style={{ textAlign: 'center', width: 70 }}>
                  {timeFormated(lapse.open)}
                </OText>
                <OText style={{ textAlign: 'center', width: 25 }}>
                  -
                </OText>
                <OText style={{ textAlign: 'center', width: 70 }}>
                  {timeFormated(lapse.close)}
                </OText>
              </View>
              :
              <OText color={theme.colors.red} style={{ textAlign: 'center' }}>
                {t('CLOSED', 'Closed')}
              </OText>
          ))}
        </View>
      </Accordion>
    </AccordionSection>
  )
}
