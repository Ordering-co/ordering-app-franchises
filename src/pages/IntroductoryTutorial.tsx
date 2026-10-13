import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Platform } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useTheme } from 'styled-components/native';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLanguage } from '@components';
import { _setStoreData, DeviceOrientationMethods, NavBar, useHomeValues } from '@ui';

const { useDeviceOrientation } = DeviceOrientationMethods

/** Same fallback as BottomNavigator when Android reports no bottom inset. */
const ANDROID_BOTTOM_INSET_FALLBACK = 40

const IntroductoryTutorial = ({ route }: any) => {
  const [, t] = useLanguage();
  const theme = useTheme();
  const insets = useSafeAreaInsets()
  const bottomInset =
    Platform.OS === 'android' && !insets.bottom
      ? ANDROID_BOTTOM_INSET_FALLBACK
      : insets.bottom
  const [orientationState] = useDeviceOrientation();
  const [showSkipButton, setShowSkipButton] = useState(true)
  const [, { onChangeAlternativeHome }] = useHomeValues()

  const WIDTH_SCREEN = orientationState?.dimensions?.width
  const HEIGHT_SCREEN = orientationState?.dimensions?.height

  const setTutorial = route?.params?.setTutorial;

  const data = [...Array(4).keys()].map((_, index) => {
    return {
      key: index,
      image: theme.images.tutorials[`slide${index + 1}`],
      bg: theme.colors.white
    }
  })

  type Item = typeof data[0];
  const styles = StyleSheet.create({
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 0,
    },
    image: {
      position: 'absolute',
      flex: 0,
      top: 0,
      width: '100%',
      height: '85%',
      resizeMode: (WIDTH_SCREEN > 1080) ? 'contain' : 'cover'
    },
    text: {
      position: 'absolute',
      color: theme.colors.colorTextTutorial,
      fontSize: 15,
      fontFamily: 'Poppins',
      bottom: HEIGHT_SCREEN * .13,
      textAlign: 'left',
      width: WIDTH_SCREEN * .85
    },
    title: {
      position: 'absolute',
      bottom: HEIGHT_SCREEN * .22,
      fontFamily: 'Poppins',
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.colorTextTutorial,
      textAlign: 'left',
      width: WIDTH_SCREEN * .85
    },
    buttonCircle: {
      top: 3,
      minWidth: 90,
      maxWidth: 90,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    tutorialText: {
      fontSize: 18,
      fontWeight: '300',
      color: theme.colors.primary,
    },
  });

  const _renderItem = ({ item }: { item: Item }) => {
    return (
      <View
        style={{
          ...styles.slide,
          backgroundColor: item.bg,
        }}>
        <Image source={item.image} style={styles.image} />
      </View>
    );
  };

  const RenderNextButton = () => {
    return (
      <View style={{
        right: 0,
        top: 3,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
        <Text style={styles.tutorialText}>{t('TUTORIAL_NEXT', 'Next')}{' '}
          <IconAntDesign
            name='arrowright'
            color={theme.colors.primary}
            size={16}
          />
        </Text>
      </View>
    );
  };

  const RenderSkipButton = () => {
    return (
      <View style={{
        ...styles.buttonCircle,
        marginLeft: Platform.OS === 'ios' ? 0 : WIDTH_SCREEN * .45,
        start: Platform.OS === 'ios' ? WIDTH_SCREEN * 0.45 : 0
      }}>
        <Text style={styles.tutorialText}>
          {t('TUTORIAL_SKIP', 'Skip')}
        </Text>
      </View>
    );
  };

  const RenderPrevButton = () => {
    return (
      <View style={{
        ...styles.buttonCircle,
        start: WIDTH_SCREEN * 0.7
      }}>
        <Text style={styles.tutorialText}>{t('TUTORIAL_BACK', 'Back')}</Text>
      </View>
    );
  };

  const RenderDoneButton = () => {
    return (
      <View style={{
        right: 0,
        top: 3,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
        <Text style={styles.tutorialText}>
          {t('TUTORIAL_DONE', "Let's start!")}
        </Text>
      </View>
    );
  };

  const _onDone = () => {
    setTutorial(false);
    onChangeAlternativeHome(true)
    _setStoreData('isTutorial', false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <NavBar />
      <View style={{ flex: 1, paddingBottom: bottomInset }}>
        <AppIntroSlider
          renderItem={_renderItem}
          data={data}
          onDone={_onDone}
          activeDotStyle={{
            backgroundColor: theme.colors.primary,
            position: 'relative',
            right: WIDTH_SCREEN * 0.29
          }}
          dotStyle={{
            backgroundColor: 'lightgray',
            position: 'relative',
            right: WIDTH_SCREEN * 0.29
          }}
          renderDoneButton={RenderDoneButton}
          renderNextButton={RenderNextButton}
          renderSkipButton={RenderSkipButton}
          showSkipButton={showSkipButton}
          onSlideChange={(index) => {
            index >= 1 ? setShowSkipButton(false) : setShowSkipButton(true)
          }}
        />
      </View>
    </View>
  );
};
export default IntroductoryTutorial;
