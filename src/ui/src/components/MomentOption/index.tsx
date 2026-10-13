import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import CalendarStrip from 'react-native-calendar-strip'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { StyleSheet, View, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { MomentOptionParams } from '../../types';

import {
  WrapSelectOption,
  OrderTimeWrapper,
  TimeListWrapper,
  TimeContentWrapper,
  TimeItem
} from './styles';

import {
  useLanguage,
  useConfig,
  useUtils,
  useOrder,
  MomentOption as MomentOptionController,
} from '@components';
import { monthsEnum, setLocalMoment } from '../../utils';
import { TimeListItem } from './TimeListItem';
import {
  OButton,
  OIcon,
  OText
} from '@ui'

const MomentOptionUI = (props: MomentOptionParams) => {
  const {
    navigation,
    datesList,
    hoursList,
    dateSelected,
    timeSelected,
    cateringPreorder,
    isCart,
    preorderLeadTime,
    business,
    getActualSchedule,
    preorderMaximumDays,
    preorderMinimumDays,
    isPage,
    handleAsap,
    handleChangeDate,
    handleChangeTime,
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    icon: {
      marginRight: 10,
    },
    dayNameStyle: {
      textTransform: 'uppercase',
    },
    selectStyle: {
      zIndex: 10,
    },
    dateLabel: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 7.6,
      paddingHorizontal: 12,
      paddingVertical: 9,
      marginBottom: 12,
    },
    dateWrap: {
      marginTop: 40,
      borderRadius: 7.6,
      borderColor: theme.colors.border,
      borderWidth: 1,
      padding: 17,
      marginBottom: 23,
    },
    timeLabel: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 7.6,
      height: 44,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center'
    },
    calendar: {
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderColor: theme.colors.backgroundGray200,
      height: 100
    },
    calendarHeaderContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      textAlign: 'left',
      marginBottom: 17,
      borderBottomWidth: 1,
      borderColor: theme.colors.backgroundGray200
    },
    calendarHeader: {
      color: '#344050',
      alignSelf: 'flex-start',
      fontSize: 14,
      fontWeight: '400'
    },
    dateNumber: {
      color: '#B1BCCC',
      fontSize: 16,
      fontWeight: '500',
    },
    dateName: {
      color: '#B1BCCC',
      fontSize: 12,
      textTransform: 'capitalize',
    },
    highlightDateName: {
      color: '#344050',
      fontSize: 12,
      textTransform: 'capitalize',
    },
    highlightDateNumber: {
      color: '#344050',
      fontSize: 16,
      textTransform: 'capitalize',
    },
    disabledDateName: {
      color: '#B1BCCC',
      fontSize: 10,
      textTransform: 'capitalize',
      opacity: 1,
    },
    disabledDateNumber: {
      color: '#B1BCCC',
      fontSize: 14,
      fontWeight: '500'
    }
  });

  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [{ parseTime }] = useUtils()
  const [orderState] = useOrder();
  const [optionSelected, setOptionSelected] = useState({
    isAsap: false,
    isSchedule: false,
  });
  const [momentState, setMomentState] = useState({
    isLoading: 0,
    isEditing: false,
  });
  const { bottom } = useSafeAreaInsets();

  const is12hours = configs?.general_hour_format?.value?.includes('hh:mm')

  const [selectedTime, setSelectedTime] = useState(null);
  const [datesWhitelist, setDateWhitelist] = useState<any>([{ start: null, end: null }])
  const [selectDate, setSelectedDate] = useState<any>(dateSelected)
  const [timeList, setTimeList] = useState<any>(hoursList)
  const [nextTime, setNextTime] = useState<any>(null)

  const goToBack = () => navigation?.canGoBack() && navigation.goBack();

  const _handleAsap = () => {
    setMomentState({ isLoading: 1, isEditing: true });
    handleAsap();
    setOptionSelected({ isAsap: true, isSchedule: false });
    if (!orderState.options?.moment) {
      setMomentState({ isLoading: 2, isEditing: false });
    }
  };
  const handleChangeMoment = (_time?: any) => {
    const time = _time ?? selectedTime
    const momentSelected = business?.timezone
      ? moment.utc(orderState?.options?.moment).tz(business.timezone).format('HH:mm')
      : moment(moment.utc(orderState?.options?.moment).toDate()).local().format('HH:mm')
    if (time === momentSelected) {
      goToBack()
      return
    }
    setMomentState({ isLoading: 1, isEditing: true });
    handleChangeTime(time);
  };

  const momento = business?.timezone
    ? moment.tz(`${dateSelected} ${timeSelected}`, 'YYYY-MM-DD HH:mm', business.timezone).toDate()
    : moment(`${dateSelected} ${timeSelected}`, 'YYYY-MM-DD HH:mm').toDate();
  const momentUnix = momento.getTime() / 1000;
  const momentFormat = moment
    .unix(momentUnix)
    .utc()
    .format('YYYY-MM-DD HH:mm:ss');

  useEffect(() => {
    if (orderState.options?.moment) {
      setOptionSelected({ isAsap: false, isSchedule: true });
    } else {
      setOptionSelected({ isAsap: true, isSchedule: false });
    }

    if (
      momentState.isEditing &&
      (momentFormat === orderState.options?.moment || timeSelected === null)
    ) {
      setMomentState({ isLoading: 2, isEditing: false });
    }
  }, [orderState.options?.moment]);

  useEffect(() => {
    if (momentState.isLoading === 2 && !orderState?.loading) {
      goToBack();
    }
  }, [momentState.isLoading]);

  const onSelectDate = (val: any) => {
    setSelectedDate(val)
    if (handleChangeDate) handleChangeDate(moment(val).format('YYYY-MM-DD'))
  }

  const handleChangeTimeSelected = (time: any) => {
    if (cateringPreorder) {
      handleChangeMoment(time)
    } else {
      setSelectedTime(time)
    }
  }

  const LeftSelector = () => {
    return (
      <View style={{ height: '100%', justifyContent: 'flex-end' }}>
        <IconAntDesign
          name='caretleft'
          color={theme.colors.textNormal}
          size={16}
        />
      </View>
    )
  }

  const RightSelector = () => {
    return (
      <View style={{ height: '100%', justifyContent: 'flex-end' }}>
        <IconAntDesign
          name='caretright'
          color={theme.colors.textNormal}
          size={16}
        />
      </View>
    )
  }

  useEffect(() => {
    if (datesList?.length > 0) {
      const _datesList = datesList.slice((cateringPreorder && preorderMinimumDays) || 0, Number(cateringPreorder ? preorderMaximumDays || configs?.max_days_preorder?.value : configs?.max_days_preorder?.value ?? 6))
      if (_datesList?.length > 0) {
        const minDateParts = _datesList?.[0]?.split('-')
        const maxDateParts = _datesList[_datesList.length - 1].split('-')
        const _minDate = new Date(minDateParts[0], minDateParts[1] - 1, minDateParts[2])
        const _maxDate = new Date(maxDateParts[0], maxDateParts[1] - 1, maxDateParts[2])
        setDateWhitelist([{ start: _minDate, end: _maxDate }])
      }
    }
  }, [JSON.stringify(datesList), preorderMinimumDays, preorderMaximumDays])

  useEffect(() => {
    if (dateSelected) {
      const dateParts = dateSelected.split('-')
      const _dateSelected = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
      setSelectedDate(_dateSelected)
      if (cateringPreorder) {
        onSelectDate(_dateSelected)
      }
    }
  }, [dateSelected])

  useEffect(() => {
    setSelectedTime(timeSelected)
  }, [timeSelected])

  useEffect(() => {
    if (cateringPreorder) {
      let _timeLists = []
      const schedule = business && getActualSchedule()
      if (!schedule && business) {
        setTimeList([])
        return
      }
      _timeLists = hoursList
        .filter(hour => {
          return (Object.keys(business || {})?.length === 0 || schedule?.lapses?.some((lapse: any) => {
            const openHour = lapse.open.hour < 10 ? `0${lapse.open.hour}` : lapse.open.hour
            const openMinute = lapse.open.minute < 10 ? `0${lapse.open.minute}` : lapse.open.minute
            const closeHour = lapse.close.hour < 10 ? `0${lapse.close.hour}` : lapse.close.hour
            const closeMinute = lapse.close.minute < 10 ? `0${lapse.close.minute}` : lapse.close.minute
            return moment(dateSelected + ` ${hour.startTime}`) >= moment(dateSelected + ` ${openHour}:${openMinute}`).add(preorderLeadTime, 'minutes') && moment(dateSelected + ` ${hour.endTime}`) <= moment(dateSelected + ` ${closeHour}:${closeMinute}`)
          })) &&
            (moment(dateSelected + ` ${hour.startTime}`) < moment(dateSelected + ` ${hour.endTime}`)) &&
            (moment().add(preorderLeadTime, 'minutes') < moment(dateSelected + ` ${hour.startTime}`) || !cateringPreorder)
        })
        .map(hour => {
          return {
            value: hour.startTime,
            text: is12hours ? (
              hour.startTime.includes('12')
                ? `${hour.startTime}PM`
                : parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
            ) : (
              parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
            ),
            endText: is12hours ? (
              hour.endTime.includes('12')
                ? `${hour.endTime}PM`
                : parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'hh:mma' })
            ) : (
              parseTime(moment(hour.endTime, 'HH:mm'), { outputFormat: 'HH:mm' })
            )
          }
        })
      if (_timeLists?.length > 0) {
        setTimeList(_timeLists)
      }
    } else {
      const schedule = getActualSchedule()
      setTimeList(hoursList
        .filter(hour => {
          return (schedule?.lapses ?? []).some((lapse: any) => {
            const pad = (value: number) => String(value).padStart(2, '0')
            return moment(dateSelected + ` ${hour.startTime}`) >= moment(dateSelected + ` ${pad(lapse.open.hour)}:${pad(lapse.open.minute)}`) && moment(dateSelected + ` ${hour.endTime}`) <= moment(dateSelected + ` ${pad(lapse.close.hour)}:${pad(lapse.close.minute)}`)
          })
        })
        .map(hour => {
        return {
          value: hour.startTime,
          text: is12hours ? (
            hour.startTime.includes('12')
              ? `${hour.startTime}PM`
              : parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'hh:mma' })
          ) : (
            parseTime(moment(hour.startTime, 'HH:mm'), { outputFormat: 'HH:mm' })
          )
        }
      }))
    }
  }, [dateSelected, hoursList?.length, JSON.stringify(datesWhitelist), JSON.stringify(business)])

  useEffect(() => {
    setLocalMoment(moment, t)
  }, [])

  useEffect(() => {
    if (preorderMinimumDays === 0 && preorderLeadTime === 0) return
    const isToday = dateSelected === moment().format('YYYY-MM-DD')
    if (isCart && isToday && !orderState?.loading && timeList?.length > 0) {
      setNextTime(timeList?.[0] ?? null)
    }
  }, [timeList?.length])

  useEffect(() => {
    if (nextTime?.value && timeList?.length > 0 && isCart && !orderState?.loading && !(preorderMinimumDays === 0 && preorderLeadTime === 0)) {
      const notime = timeList?.filter((_: any, i: number) => i !== 0)?.find?.((time: any) => time?.value === timeSelected)
      if (!notime) {
        handleChangeTime(nextTime?.value)
      }
    }
  }, [nextTime?.value])

  return (
    <>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={{
          paddingVertical: 20,
          paddingLeft: !cateringPreorder || isPage ? 20 : 0,
          paddingRight: !cateringPreorder || isPage ? 20 : 0,
        }}
      >
        <View style={{ paddingBottom: cateringPreorder ? 0 : 90 }}>
          {(preorderMinimumDays === 0 && preorderLeadTime === 0) || !cateringPreorder && (
            <>
              <OText color={theme.colors.black} weight={800} mBottom={20}>
                {t('DATE_AND_TIME', 'Date & Time')}
              </OText>
              <WrapSelectOption
                onPress={() => _handleAsap()}
                disabled={orderState.loading}
              >
                <OIcon
                  src={optionSelected.isAsap ? theme.images.general.radio_act : theme.images.general.radio_nor}
                  width={16}
                  style={{ marginRight: 10 }}
                  color={optionSelected.isAsap ? theme?.colors?.primary : theme.colors.disabled}
                />
                <View style={{ width: '90%' }}>
                  <OText color={optionSelected.isAsap ? theme.colors.textNormal : theme.colors.disabled}>
                    {`${t('ASAP_ABBREVIATION', 'ASAP')} (${t(moment().format('dddd')?.toLocaleUpperCase(), moment().format('dddd'))}, ${t(monthsEnum[moment().format('MMM')], moment().format('MMM'))}${moment().format(' D, YYYY h:mm A')} + ${t('DELIVERY_TIME', 'delivery time')})`}
                  </OText>
                </View>
              </WrapSelectOption>
            </>
          )}
          <WrapSelectOption
            onPress={() => setOptionSelected({ isAsap: false, isSchedule: true })}
            disabled={orderState.loading}
          >
            <OIcon
              src={optionSelected.isSchedule ? theme.images.general.radio_act : theme.images.general.radio_nor}
              width={16}
              style={{ marginRight: 10 }}
              color={optionSelected.isSchedule ? theme?.colors?.primary : theme.colors.disabled}
            />
            <OText color={optionSelected.isSchedule ? theme.colors.textNormal : theme.colors.disabled}>
              {t('SCHEDULE_FOR_LATER', 'Schedule for later')}
            </OText>
          </WrapSelectOption>
          {optionSelected.isSchedule && (
            <OrderTimeWrapper>
              {datesWhitelist[0]?.start === datesWhitelist[0]?.end && (
                <OText>
                  {moment(selectDate).format('Do MMMM, YYYY')}
                </OText>
              )}
              {datesWhitelist[0]?.start !== datesWhitelist[0]?.end && (
                <View style={{ flex: 1 }}>
                  {selectDate && datesWhitelist[0]?.start !== null && (
                    <CalendarStrip
                      scrollable
                      style={styles.calendar}
                      calendarHeaderContainerStyle={styles.calendarHeaderContainer}
                      calendarHeaderStyle={styles.calendarHeader}
                      iconContainer={{ flex: 0.1 }}
                      dayContainerStyle={{ height: '100%' }}
                      highlightDateContainerStyle={{ height: '100%' }}
                      calendarHeaderFormat='MMMM, YYYY'
                      iconStyle={{ borderWidth: 1 }}
                      selectedDate={dateSelected}
                      datesWhitelist={datesWhitelist}
                      highlightDateNumberStyle={styles.highlightDateNumber}
                      highlightDateNameStyle={styles.highlightDateName}
                      minDate={moment()}
                      maxDate={cateringPreorder ? moment().add(preorderMaximumDays, 'days') : undefined}
                      disabledDateNameStyle={styles.disabledDateName}
                      disabledDateNumberStyle={styles.disabledDateNumber}
                      disabledDateOpacity={0.6}
                      dateNumberStyle={styles.dateNumber}
                      dateNameStyle={styles.dateName}
                      onDateSelected={(date: any) => onSelectDate(date)}
                      leftSelector={<LeftSelector />}
                      rightSelector={<RightSelector />}
                    />
                  )}
                </View>
              )}
              <View style={{ width: '100%', marginTop: 20, backgroundColor: '#FFEFD0', padding: 10, borderRadius: 7.6 }}>
                <OText color='#F1C875'>
                  {t('PREORDER_TIME_MESSAGE', 'The selected time is only to prepare the order. Delivery orders do not include the delivery time.')}
                </OText>
              </View>
              <TimeListWrapper nestedScrollEnabled={true} cateringPreorder={cateringPreorder}>
                {timeList?.length > 0 ? (
                  <TimeContentWrapper>
                    {timeList.map((time: any, i: number) => (
                      <TimeListItem
                        key={i}
                        time={time}
                        selectedTime={selectedTime}
                        handleChangeTimeSelected={handleChangeTimeSelected}
                        cateringPreorder={cateringPreorder}
                      />
                    ))}
                    {timeList.length % 3 === 2 && (
                      <TimeItem style={{ backgroundColor: 'transparent' }} />
                    )}
                  </TimeContentWrapper>
                ) : (
                  <OText
                    size={16}
                    style={{
                      fontWeight: '600',
                      lineHeight: 24,
                      marginBottom: 12,
                      textAlign: 'center'
                    }}
                  >
                    {t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment')}
                  </OText>
                )}
              </TimeListWrapper>
            </OrderTimeWrapper>
          )}
        </View>
        <Spinner visible={momentState.isLoading === 1} />
      </ScrollView>
      {!isCart && !cateringPreorder && (
        <View style={{ position: 'absolute', bottom: bottom, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white', width: '100%' }}>
          <OButton
            onClick={() => handleChangeMoment()}
            isDisabled={!selectedTime}
            text={t('CONTINUE', 'Continue')}
            style={{ borderRadius: 7.6, height: 44, shadowOpacity: 0 }}
            textStyle={{ fontSize: 14 }}
            bgColor={theme?.colors?.primary}
          />
        </View>
      )}
    </>
  );
};

export const MomentOption = (props: any) => {
  const momentOptionProps = {
    ...props,
    UIComponent: MomentOptionUI,
  };
  return <MomentOptionController {...momentOptionProps} />;
};
