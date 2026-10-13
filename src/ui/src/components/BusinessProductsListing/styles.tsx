import styled, { css } from 'styled-components/native'

export const WrapperProductList = styled.View`
  flex: 1;
  background-color: ${({ theme }: any) => theme?.business_view?.components?.style?.backgroundColor ?? theme.colors.backgroundPage};
  padding-bottom: 0;
`

export const WrapperNoAuth = styled.View`
  flex: 1;
  width: 100%;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
  position: relative;
  justify-content: center;
  align-items: center;
`

export const WrapHeader = styled.View`
  position: relative;
`
export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ hideArrow }: any) => hideArrow ? 'flex-end' : 'space-between'};
  z-index: 1;
  height: 60px;
  min-height: 60px;
`
export const AddressInput = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0,0,0,0.3);
  padding: 15px;
  border-radius: 24px;
`
export const WrapSearchBar = styled.View`
  padding: 8px 30px;
  background-color: ${(props: any) => props.theme.colors.white};
  flex: 1;
`

export const BusinessProductsListingContainer = styled.ScrollView`
  flex: 1;
  ${({ isActiveFloatingButtom }: { isActiveFloatingButtom: boolean }) => isActiveFloatingButtom && css`
    margin-bottom: 50px;
  `}
`

export const FiltProductsContainer = styled.ScrollView`
  position: absolute;
  width: 100%;
  z-index: 20000;
`

export const BackgroundGray = styled.View`
  flex: 1;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  position: absolute;
  z-index: 10000;
  width: 100%;
`

export const ProfessionalFilterWrapper = styled.View`
  padding-left: 20px;
  margin-bottom: 35px;
`

export const NearBusiness = styled.View`
  width: 100%;
  padding-left: 20px;
  max-height: 80px;
`

export const TopActions = styled.TouchableOpacity`
	height: 60px;
	justify-content: center;
  padding-horizontal: 20px;
  width: 100px;
`;

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

export const WrapperCartButton = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  width: 100%;
  padding: 12px 20px;
  flex-direction: column;
  border-top-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  background-color: ${(props: any) => props.theme.colors.white};
  z-index: ${(props: any) => props.theme.utils.zi.xl};
`

export const CartButton = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  height: 50px;
  background-color: ${(props: any) => props.theme.colors.primary};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
`
