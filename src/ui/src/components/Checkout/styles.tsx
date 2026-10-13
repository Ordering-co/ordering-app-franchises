import styled, { css } from 'styled-components/native';

export const Container = styled.ScrollView``

export const ChContainer = styled.View`
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const CHDetailWrapper = styled.View`
  width: 100%;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const ChSection = styled.View`
`

export const ChHeader = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`

export const ChTotal = styled.View`
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`

export const ChTotalWrap = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const ChAddress = styled.View`
  width: 100%;
`

export const ChMoment = styled(ChAddress)`
  padding: 0 0 20px;
`

export const CHMomentWrapper = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: ${({ theme }: any) => theme?.utils?.radius.l}px;
  font-size: 12px;
  max-width: 240px;
  height: 26px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  flex-direction: row;
  margin-end: 12px;
`

export const ChUserDetails = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding-bottom: 34px;
`

export const ChBusinessDetails = styled(ChUserDetails)`
  padding-top: 20px;
`

export const ChPaymethods = styled.View`
  display: flex;
  flex-direction: column;
`

export const ChDriverTips = styled(ChPaymethods)``

export const ChCart = styled(ChPaymethods)`
`

export const WalletPaymentOptionContainer = styled(ChPaymethods)`
  margin-bottom: 5px;
`

export const ChPlaceOrderBtn = styled.View`
  width: 100%;
  display: flex;
  justify-content: center;
`

export const ChErrors = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`

export const DeliveryOptionsContainer = styled.View`
  flex: 1;
  margin-top: 10px;
`

export const DeliveryOptionItem = styled.View`
  padding: 15px;
  justify-content: ${(props: any) => props.center ? 'center' : 'space-between'};
  align-items: center;
  flex-direction: row;
  background-color: ${(props: any) => props?.backgroundColor ?? '#fff'};
`;

export const CartHeader = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const TopActions = styled.TouchableOpacity`
	height: 60px;
	justify-content: center;
  min-width: 30px;
  padding-right: 15px;
`;

export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  height: 60px;
  min-height: 60px;
`

export const OrderTypesContainer = styled.View`
  padding: 10px;
  border-bottom-left-radius: 9px;
  border-bottom-right-radius: 9px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme?.colors?.border};
`

export const DeliveryOptionSelectContainer = styled.View`
  background-color: ${({ theme }: any) => theme.colors.inputDisabled};
  border-radius: ${({ theme }: any) => theme?.utils?.radius.l}px;
  margin-bottom: 20px;
  flex: 1;
`
/* Payment item styles */

export const PIContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 0;
  ${(props: any) => props.bt && css`
    border-top-width: 1px;
    border-top-color: ${({ theme }: any) => theme.colors.border};
  `}
`

export const PIBtn = styled.TouchableOpacity`
  width: 30%;
`

export const PIContent = styled.View`
  flex-direction: row;
  align-items: center;
  width: 70%;
`
export const PIText = styled.View`
  flex-direction: column;
  margin-left: 10px;
`

export const WrapperInfoMessage = styled.View`
  padding: 10px ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 9999;
`
