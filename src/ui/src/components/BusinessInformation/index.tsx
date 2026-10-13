import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment-timezone';

import { useTheme } from 'styled-components/native';
import { WebView } from 'react-native-webview';

import { BusinessInformationParams } from '../../types';
import { formatUrlVideo } from '../../utils'

import {
  BusinessInformationContainer,
  WrapMainContent,
  GrayBackground,
  WrapScheduleBlock,
  ScheduleBlock,
  WrapBusinessMap,
  InnerContent,
  DivideView,
  MediaWrapper,
} from './styles';

import { BusinessInformation as BusinessInformationController, useLanguage, useUtils, useConfig } from '@components';
import { DeviceOrientationMethods, ScheduleAccordion, GoogleMap, OIcon, OText } from '@ui'

const { useDeviceOrientation } = DeviceOrientationMethods

const BusinessInformationUI = (props: BusinessInformationParams) => {
  const {
    businessState,
    businessSchedule,
    businessLocation
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ optimizeImage }] = useUtils();
  const [{ configs }] = useConfig()
  const [orientationState] = useDeviceOrientation();

  const [isReadMore, setIsReadMore] = useState(false)
  const [lengthMore, setLengthMore] = useState(false)
  const WIDTH_SCREEN = orientationState?.dimensions?.width

  const hideLocation = theme?.business_view?.components?.information?.components?.location?.hidden
  const hideSchedule = theme?.business_view?.components?.information?.components?.schedule?.hidden
  const hideVideos = theme?.business_view?.components?.information?.components?.videos?.hidden
  const hideImages = theme?.business_view?.components?.information?.components?.images?.hidden
  const hideAddress = theme?.business_view?.components?.information?.components?.address?.hidden
  const formatTime = configs?.general_hour_format?.value

  const checkTime = (val: number) => (val < 10 ? `0${val}` : val);
  const timeFormated = (time: any) => {
    const now = moment().format('YYYY-MM-DD')
    const storeTime = moment.tz(
      `${now}T${checkTime(time.hour)}:${checkTime(time.minute)}`,
      businessState?.business?.timezone || moment.tz.guess()
    );

    const localTime = storeTime.clone().tz(moment.tz.guess());
    return localTime.format(formatTime);
  };

  const bVideos = () => {
    const len = businessState?.business?.gallery?.length | 0;
    if (len == 0) return [];
    const vAry = businessState?.business?.gallery.filter(
      ({ type, file }: any) => type == 2 && file == null,
    );
    return vAry;
  };
  //{uri: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4?_=1'}
  const bImages: any = () => {
    const len = businessState?.business?.gallery?.length | 0;
    if (len == 0) return [];
    const iAry = businessState?.business?.gallery.filter(
      ({ type, video }: any) => type == 1 && video == null,
    );
    return iAry;
  };

  const onTextLayout = useCallback((e: any) => {
    setLengthMore((e.nativeEvent.lines.length == 3 && e.nativeEvent.lines[2].width > WIDTH_SCREEN * .76) || e.nativeEvent.lines.length > 3)
  }, [])

  return (
    <BusinessInformationContainer>
      <WrapMainContent showsVerticalScrollIndicator={false}>
        <InnerContent>
          {!hideLocation && businessLocation.location && (
            <WrapBusinessMap>
              <GoogleMap
                readOnly
                location={businessLocation.location}
                markerTitle={businessState?.business?.name}
                businessZones={businessState?.business?.zones}
              />
            </WrapBusinessMap>
          )}
          {!!props.showBusinessName && (
            <OText mBottom={10} weight={'bold'} size={theme.utils.tsize.m} color={theme.colors.textNormal}>
              {businessState?.business?.name}
            </OText>
          )}
          {!hideAddress && (
            <OText mBottom={10} color={theme.colors.textNormal}>
              {businessState?.business?.address}
            </OText>
          )}
          {businessState?.business?.address_notes && (
            <>
              <OText
                size={12}
                mBottom={10}
                numberOfLines={isReadMore ? 20 : 3}
                onTextLayout={onTextLayout}
              >
                {businessState?.business?.address_notes}
              </OText>
              {lengthMore && (
                <TouchableOpacity
                  onPress={() => setIsReadMore(!isReadMore)}
                >
                  <OText size={12} mBottom={20} color={theme.colors.primary}>{isReadMore ? t('SHOW_LESS', 'Show less') : t('READ_MORE', 'Read more')}</OText>
                </TouchableOpacity>
              )}
            </>
          )}
          <DivideView />
          {!hideSchedule && businessSchedule && businessSchedule?.length > 0 && (
            <>
              <GrayBackground>
                <OText size={theme.utils.tsize.m} weight="500" color={theme.colors.textNormal}>
                  {t('OPENING_TIME', 'Opening Time')}
                </OText>
              </GrayBackground>
              <WrapScheduleBlock>
                {businessSchedule.map((schedule: any, i: number) => (
                  <ScheduleBlock key={i}>
                    <ScheduleAccordion
                      weekIndex={i}
                      timeFormated={timeFormated}
                      schedule={schedule}
                    />
                  </ScheduleBlock>
                ))}
              </WrapScheduleBlock>
            </>
          )}

          <>
            {!hideVideos && (
              <>
                {bVideos().length > 0 && (
                  <>
                    <DivideView />
                    <GrayBackground>
                      <OText size={theme.utils.tsize.m} weight="500">
                        {t('VIDEOS', 'Videos')}
                      </OText>
                    </GrayBackground>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      nestedScrollEnabled={true}
                      data={bVideos()}
                      horizontal
                      style={{
                        marginTop: 16,
                        marginBottom: 30,
                        minHeight: 127,
                        height: 127
                      }}
                      renderItem={({ item, index }) => (
                        <WebView
                          key={`vid_id_${index}`}
                          style={{ width: 210, height: 127, borderRadius: 7.6 }}
                          javaScriptEnabled={true}
                          domStorageEnabled={true}
                          source={{
                            html: `
                        <iframe width='80%' height='80%' src="${formatUrlVideo(item.video)}" frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen />
                        `,
                          }}
                          mediaPlaybackRequiresUserAction={true}
                        />
                      )}
                    />
                  </>
                )}
              </>
            )}

            {!hideImages && (
              <>
                {bImages().length > 0 && (
                  <>
                    <DivideView />
                    <GrayBackground>
                      <OText size={theme.utils.tsize.m} weight="500">
                        {t('IMAGES', 'Images')}
                      </OText>
                    </GrayBackground>
                    <MediaWrapper horizontal>
                      {bImages().map((i: any) => (
                        i.file != null &&
                        <View key={i.id} style={{ width: 210, height: 127, borderRadius: 7.6, marginEnd: 20, overflow: 'hidden' }}>
                          <OIcon cover url={optimizeImage(i?.file, 'h_150,c_limit')} width={210} height={127} />
                        </View>
                      ))}
                    </MediaWrapper>
                  </>
                )}
              </>
            )}
          </>
        </InnerContent>
      </WrapMainContent>
    </BusinessInformationContainer>
  );
};

export const BusinessInformation = (props: BusinessInformationParams) => {
  const BusinessInformationProps = {
    ...props,
    UIComponent: BusinessInformationUI,
  };
  return <BusinessInformationController {...BusinessInformationProps} />;
};
