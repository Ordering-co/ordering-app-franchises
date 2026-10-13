import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useTheme } from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient'

import { StaturBar, StatusDivider, StatusPointsContent, StatusRedeemGiftCard, StatusWrapperPoints } from './styles'
import { TabContainer } from '../styles'
import { Benefits } from './Benefits'
import { Utils } from '../constants'

import { useLanguage } from '@components'
import { OButton, OModal, OText } from '@ui'

export const Status = (props: any) => {
  const { userLoyaltyLevel, levelList } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const { progressBarValue } = Utils()

  const [openBenefits, setOpenBenefits] = useState(false)

  const loyaltyBenefits = userLoyaltyLevel?.loyaltyLevel?.benefits ?? []

  const calculateNextLevelProgress = (currentLevelId: number, currentPoints: number) => {
    const levels = levelList.levels.sort((a: any, b: any) => a.minimum_points - b.minimum_points);
    const currentIndex = levels.findIndex((level: any) => level.id === currentLevelId);
    const nextLevel = levels[currentIndex + 1];

    if (!nextLevel) {
      return { nextLevelPercentage: 100, missingPoints: 0 }
    }

    const pointsToNextLevel = nextLevel.minimum_points - currentPoints;
    const pointsInCurrentLevel = nextLevel.minimum_points - (levels[currentIndex]?.minimum_points || 0);
    const pointsEarnedInCurrentLevel = currentPoints - (levels[currentIndex]?.minimum_points || 0);
    const nextLevelPercentage = (pointsEarnedInCurrentLevel / pointsInCurrentLevel) * 100;

    return {
      nextLevelPercentage: Math.min(nextLevelPercentage, 100),
      missingPoints: Math.max(pointsToNextLevel, 0),
      nextLevel
    }
  }

  const { nextLevelPercentage, missingPoints, nextLevel } = calculateNextLevelProgress(
    userLoyaltyLevel?.loyaltyLevel?.id,
    userLoyaltyLevel?.loyaltyLevel?.loyalty_level_points
  )

  return (
    <>
      <TabContainer>
        <StatusRedeemGiftCard>
          <View style={{ width: '100%' }}>
            <OText
              color={theme.colors.primary}
              size={theme.utils.tsize.m}
              weight={600}
              style={{ textTransform: 'uppercase', textAlign: 'left' }}
            >
              {userLoyaltyLevel?.loyaltyLevel?.name}
            </OText>
          </View>
          <StatusPointsContent>
            <StatusWrapperPoints>
              <OText
                color={theme.colors.textNormal}
                size={userLoyaltyLevel?.loyaltyLevel?.loyalty_level_points > 99999 ? 32 : 55}
                weight={600}
              >
                {userLoyaltyLevel?.loyaltyLevel?.loyalty_level_points}
                <OText color={theme.colors.disabled}>
                  {t('POINTS', 'Points')}
                </OText>
              </OText>
              <StaturBar>
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{
                    x: nextLevelPercentage / 100,
                    y: 0,
                  }}
                  locations={[0.9999, 0.9999]}
                  colors={[theme.colors.primary, theme.colors.backgroundGray100]}
                  style={styles.statusBar}
                />
              </StaturBar>
            </StatusWrapperPoints>
            <FastImage
              source={theme.images.general.trophie}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.icon}
            />
          </StatusPointsContent>
          <StatusPointsContent style={{ marginTop: 10 }}>
            <OText
              color={theme.colors.secondaryLightGray}
              size={theme.utils.tsize.xs}
              weight={600}
              numberOfLines={2}
              ellipsizeMode='tail'
              style={{ width: loyaltyBenefits.length > 0 ? '60%' : '100%' }}
            >
              {missingPoints > 0 ? (
                `${t('NEXT_LEVEL_TITLE', 'You need _points_ to reach').replace('_points_', missingPoints)} ${nextLevel?.name}`
              ) : (
                t('YOU_ARE_IN_LAST_LEVEL', 'You already reach the last level')
              )}
            </OText>
            {loyaltyBenefits.length > 0 && (
              <OButton
                text={t('VIEW_BENEFITS', 'View Benefits')}
                bgColor={theme.colors.white}
                borderColor={theme.colors.primary}
                imgRightSrc={null}
                textStyle={{ color: theme.colors.primary, fontSize: theme.utils.tsize.xs, fontWeight: '500' }}
                style={{ paddingLeft: 0, paddingRight: 0, height: 40, borderWidth: 1 }}
                onClick={() => setOpenBenefits(!openBenefits)}
              />
            )}
          </StatusPointsContent>
        </StatusRedeemGiftCard>
        {/* <StatusDivider /> */}
      </TabContainer>
      <OModal
        open={openBenefits}
        onClose={() => setOpenBenefits(false)}
        entireModal
      >
        <Benefits
          title={userLoyaltyLevel?.loyaltyLevel?.name}
          image={userLoyaltyLevel?.loyaltyLevel?.image}
          benefits={loyaltyBenefits}
        />
      </OModal>
    </>
  )
}

const styles = StyleSheet.create({
  icon: {
    width: 80,
    height: 80
  },
  statusBar: {
    height: 8,
    borderRadius: 10
  }
})
