import styled from 'styled-components/native'
import { RedeemDivider, RedeemGiftCard } from '../styles'

export const StatusRedeemGiftCard = styled(RedeemGiftCard)`
`

export const StatusPointsContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const StatusWrapperPoints = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  width: 70%;
`

export const StaturBar = styled.View``

export const StatusDivider = styled(RedeemDivider)``

export const BenefitsWrapper = styled.ScrollView``

export const BenefitsContainer = styled.View`
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`

export const BenefitItem = styled.View`
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.border};
  padding: 20px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
`

export const BenefitsList = styled.View`
  margin-top: 20px;
`
