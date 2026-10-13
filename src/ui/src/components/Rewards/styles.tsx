import styled, { css } from 'styled-components/native'

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`

export const Content = styled.View``

export const Header = styled.View`
  margin: 0 auto;
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
`

export const TabContainer = styled.View`
  ${({ p, theme }: any) => p && css`
    padding-horizontal: ${theme.utils.margins.horizontal}px;
  `}
`

export const RedeemHeader = styled.View`
  background-color: ${({ theme }: any) => theme.colors.backgroundGray100};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`

export const RedeemCashWallet = styled.View`
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.backgroundGray100};
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
`

export const RedeemContent = styled.View`
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
`

export const RedeemTransactionsList = styled.TouchableOpacity`
  margin: 10px 20px 20px;
  align-self: flex-end;
`

export const RedeemDivider = styled.View`
  height: 6px;
  background-color: ${({ theme }: any) => theme.colors.backgroundGray100};
`

export const RedeemGiftCard = styled.View`
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.backgroundGray100};
  padding: 20px;
  margin: 0  ${({ theme }: any) => theme.utils.margins.horizontal}px 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
`

export const GiftCardActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`

export const WrapperBtn = styled.View`
  width: 40%;
`

export const WrapperNoAuth = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
`
