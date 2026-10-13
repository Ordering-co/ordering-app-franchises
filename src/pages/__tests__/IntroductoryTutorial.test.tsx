import { fireEvent } from '@testing-library/react-native'
import { _setStoreData, useHomeValues } from '@ui'

import IntroductoryTutorial from '../IntroductoryTutorial'
import { renderPage } from '../../../jest/helpers/renderPage'
import { setupPageTestEnv } from '../../../jest/helpers/pageTestSetup'

jest.mock('@ui', () => require('../../../jest/helpers/mockUi'))

jest.mock('react-native-app-intro-slider', () => {
  const { View, TouchableOpacity } = require('react-native')
  return function AppIntroSlider (props: any) {
    return (
      <View testID='intro-slider'>
        <TouchableOpacity testID='intro-done' onPress={props.onDone} />
        <TouchableOpacity
          testID='intro-slide-change'
          onPress={() => props.onSlideChange?.(1)}
        />
        {props.renderNextButton?.()}
        {props.renderSkipButton?.()}
      </View>
    )
  }
})

describe('IntroductoryTutorial page', () => {
  beforeEach(() => {
    setupPageTestEnv()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders slides and completes tutorial', () => {
    const setTutorial = jest.fn()
    const onChangeAlternativeHome = jest.fn()
    useHomeValues.mockReturnValue([{ userAddressStoraged: null }, { onChangeAlternativeHome }])
    const { getByTestId } = renderPage(IntroductoryTutorial, {
      route: { params: { setTutorial } }
    })
    expect(getByTestId('intro-slider')).toBeTruthy()
    fireEvent.press(getByTestId('intro-done'))
    expect(_setStoreData).toHaveBeenCalledWith('isTutorial', false)
    expect(setTutorial).toHaveBeenCalledWith(false)
    expect(onChangeAlternativeHome).toHaveBeenCalledWith(true)
  })

  it('hides skip after first slide change', () => {
    const { getByTestId } = renderPage(IntroductoryTutorial, {
      route: { params: { setTutorial: jest.fn() } }
    })
    fireEvent.press(getByTestId('intro-slide-change'))
    expect(getByTestId('intro-slider')).toBeTruthy()
  })
})
