import React from 'react';
import { useConfig, useLanguage, useOrder } from '@components';

import { SafeAreaViewWrapper } from '../layouts/SafeAreaViewWrapper'
import { MomentOption as MomentOptionController, NavBar } from '@ui';
interface Config {
  key: string;
  value: string;
}

const MomentOption = ({ navigation, route }: any) => {
  const [{ configs }] = useConfig();
  const [orderState] = useOrder();
  const [, t] = useLanguage()
  const currentDate = new Date();
  const cateringTypes = [7, 8]
  const cateringTypeString = orderState?.options?.type === 7
    ? 'catering_delivery'
    : orderState?.options?.type === 8
      ? 'catering_pickup'
      : null
  const splitCateringValue = (configName: string) => (Object.values(configs) as Config[])?.find((config: any) => config.key === configName)?.value?.split('|')?.find((val: any) => val.includes(cateringTypeString))?.split(',')[1] ?? ''
  const preorderSlotInterval = parseInt(splitCateringValue('preorder_slot_interval'))
  const preorderLeadTime = parseInt(splitCateringValue('preorder_lead_time'))
  const preorderTimeRange = parseInt(splitCateringValue('preorder_time_range'))
  const preorderMaximumDays = parseInt(splitCateringValue('preorder_maximum_days'))
  const preorderMinimumDays = parseInt(splitCateringValue('preorder_minimum_days'))
  const limitDays = cateringTypes.includes(orderState?.options?.type) ? preorderMaximumDays ?? configs?.max_days_preorder?.value : configs?.max_days_preorder?.value;
  const time =
    limitDays > 1
      ? currentDate.getTime() + (limitDays - 1) * 24 * 60 * 60 * 1000
      : limitDays === 1
        ? currentDate.getTime()
        : currentDate.getTime() + 6 * 24 * 60 * 60 * 1000;

  currentDate.setTime(time);
  currentDate.setHours(23);
  currentDate.setMinutes(59);
  const momentOptionProps = {
    ...route?.params,
    navigation: navigation,
    maxDate: currentDate,
    cateringPreorder: cateringTypes.includes(orderState?.options?.type),
    preorderSlotInterval,
    preorderLeadTime,
    preorderTimeRange,
    preorderMinimumDays,
    preorderMaximumDays,
    isPage: true
  };
  return (
    currentDate && (
      <>
        <NavBar
          title={t('SCHEDULE_ORDER', 'Schedule Order')}
          onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
        />
        <SafeAreaViewWrapper disableScrollView>
          <MomentOptionController {...momentOptionProps} />
        </SafeAreaViewWrapper>
      </>
    )
  )
}

export default MomentOption;
