import styled from 'styled-components/native'

export const UpsellingContentContainer = styled.View`
  padding-bottom: 120px;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const UpsellingContainer = styled.View`
  margin: 20px 0;
`
export const Item = styled.View`
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: 7.6px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px;
  margin-right: 12px;
  min-width: 207px;
  max-width: 207px;
  width: 207px;
`
export const Details = styled.View`
  align-items: flex-start;
  justify-content: center;
`
export const AddButton = styled.TouchableOpacity`
	padding: 4px 8px;
	background-color: ${(props: any) => props.theme.colors.primaryContrast};
	border-radius: 30px;
	width: 40%;
	align-items: center;
	margin-top: 6px;
`
export const CloseUpselling = styled.View`
  margin-vertical: 10px;
  width: 100%;
`
export const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  padding-horizontal: 40px;
`
export const TopActions = styled.TouchableOpacity`
	height: 44px;
	justify-content: center;
`;

export const CartList = styled.ScrollView`
  padding: 20px;
  overflow: visible;
`

export const CartDivider = styled.View`
  height: 8px;
  background-color:  ${(props: any) => props.theme.colors.backgroundGray100};
  margin: 20px -40px 0;
`


export const TopActionsHeader = styled.TouchableOpacity`
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

export const WrapperButtons = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  width: 100%;
  padding: 20px 20px ${(props: any) => props.pb}px;
  flex-direction: row;
  border-top-width: 1px;
  justify-content: space-between;
  border-color: ${(props: any) => props.theme.colors.border};
  background-color: ${(props: any) => props.theme.colors.white};
  z-index: ${(props: any) => props.theme.utils.zi.xl};
`

export const WrapperUpsellingProducts = styled.View`
  padding-top: 20px;
  margin-bottom: 40px;
`

export const Separator = styled.View`
  width: 100%;
  height: 6px;
  margin-bottom: 20px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`
