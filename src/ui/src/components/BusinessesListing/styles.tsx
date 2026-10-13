import styled, { css } from 'styled-components/native'

export const WelcomeTitle = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`

export const BusinessList = styled.View`
  flex-wrap: wrap;
`

export const Search = styled.View`
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  ${(props: any) => props.isChewLayout && css`
    margin-horizontal: 30px;
  `}
  border-top-width: 0.5px;
  border-top-color: ${({ theme }: any) => theme?.colors?.border};
  border-bottom-width: 0.5px;
  border-bottom-color: ${({ theme }: any) => theme?.colors?.border};
`

export const AddressInput = styled.TouchableOpacity`
  flex-direction: row;
  background-color: ${(props: any) => props.theme.colors.white};
  padding-horizontal: 20px;
  align-items: center;
  width: 100%;
  height: 44px;
  max-height: 44px;
`

export const OrderControlContainer = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  padding-bottom: 20px;
  flex: 1;
`

export const WrapMomentOption = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 7.6px;
  font-size: 12px;
  max-width: 240px;
  height: 26px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  flex-direction: row;
  margin-end: 12px;
`

export const HeaderWrapper = styled.ImageBackground`
	width: 100%;
  height: ${({ bgHeaderHeight }: any) => bgHeaderHeight || '270px'};
	padding: 20px;
	background-color: transparent;
`;

export const ListWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
`;

export const FeaturedWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	paddingVertical: 30px;
`;

export const FarAwayMessage = styled.View`
  flex-direction: row;
  align-items: center;
	background-color: ${(props: any) => props.theme.colors.warning1};
  margin-bottom: 10px;
  border-radius: 7.6px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.warning5};
`

export const AddressInputContainer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
`

export const PreorderInput = styled(AddressInput)`
  justify-content: center;
`

export const OTabs = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: -1px;
  width: 100%;
`;

export const OTab = styled.TouchableOpacity`
  padding-bottom: 10px;
  border-bottom-width: 1px;
  margin-end: 14px;
  padding-horizontal: 5px;
`;

export const OrderTypesContainer = styled.View`
  flex-direction: row;
  font-size: 14px;
  width: 180px;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  margin-top: 10px;
  align-self: center;
`

export const BusinessLogosContainer = styled.ScrollView`
  padding-bottom: 10px;
`

export const TabBtn = styled.TouchableOpacity`
  min-height: 40px;
  height: 40px;
  width: 50%;
`;

export const TabsContainer = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: any) => theme?.colors?.border};
  margin: 0 20px;
  padding: 10px 0px;
  min-height: 45px;
`

export const Tabs = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: -15px;
  justify-content: space-around;
`

export const GoogleMapContainer = styled.View`
  flex: 1;
`

export const WrapperList = styled.View`
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
  margin-bottom: 100px;
`
