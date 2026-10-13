import styled, { css } from 'styled-components/native'

export const OrderDetailsContainer = styled.ScrollView``

export const Header = styled.View`
  position: relative;
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`

export const HeaderTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  width: 100%;
`

export const HelpBtn = styled.TouchableOpacity`
  padding: 5px 10px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
`

export const Logo = styled.View`
  margin-right: 20px;
`

export const OrderContent = styled.View`
  margin-bottom: 150px;
`

export const WrapperOptions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const WrapperActionBtns = styled.View`
  padding: 0 ${({ theme }: any) => theme.utils.margins.horizontal}px;
  flex-direction: column;
`

export const WrapperPhoto = styled.View`
  border-radius: 50px;
  background-color: ${({ theme }: any) => theme.colors.white};
  margin-right: 14px;
`

export const OrderBusiness = styled.View`
  position: relative;
  padding-vertical: 10px;
  padding-horizontal: 20px;
  background-color: ${(props: any) => props.theme.colors.white};
  align-items: flex-start;
`
export const Icons = styled.View`
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 10px;
  bottom: 0px;
`

export const OrderInfo = styled.View`
  padding: 10px 0;
  flex: 1;
`

export const OrderData = styled.View``

export const OrderStatus = styled.View`
  padding: 20px;
  align-items: center;
  width: 35%;
  flex-wrap: wrap;
`

export const StaturBar = styled.View``

export const StatusImage = styled.View``

export const SectionTitle = styled.View``

export const OrderSection = styled.View`
  padding: ${({ noPadding, theme }: any) => noPadding ? 0 : theme.utils.margins.horizontal}px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const ProfessionalBlock = styled.View`
  border-bottom-color: ${({ theme }: any) => theme.colors.border};
  border-bottom-width: 1px;
  margin-vertical: 10px;
  padding-vertical: 5px;
`

export const WrapperFullTotal = styled.View`
  flex: 1;
  padding: 20px 0;
  border-top-width: 6px;
  margin-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  border-top-color: ${(props: any) => props.theme.colors.backgroundGray100};
`

export const OrderDriver = styled(OrderSection)`
  flex: 1;
`

export const Customer = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`

export const CustomerPhoto = styled.View`
  margin-right: 20px;
`

export const InfoBlock = styled.View`
  flex: 1;
`

export const HeaderInfo = styled.View`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  padding: 20px 20px;
`

export const OrderProducts = styled(OrderSection)``

export const Table = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  padding-bottom: ${(props: any) => props.pb ?? 10}px;
`

export const OrderBill = styled.View`
  padding-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  padding-bottom: 20px;
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const Total = styled.View`
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.border};
  padding-top: 20px;
`

export const Map = styled.View`
  width: 100%;
  height: 250px;
`

export const Divider = styled.View`
  border-color: #EAEAEA;
  border-width: 1px;
  margin-top: 5px;
  margin-bottom: 5px;
`
export const OrderAction = styled.View`
  flex-direction: row;
`

export const PlaceSpotWrapper = styled.View`
  padding-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
`

export const ProfessionalPhoto = styled.ImageBackground`
  width: 100%;
  position: relative;
  max-height: 80px;
  height: 80px;
  width: 80px;
  resize-mode: cover;
  margin-right: 10px;
`;

export const TopActions = styled.TouchableOpacity`
	height: 60px;
	justify-content: center;
  min-width: 30px;
  padding-right: 15px;
`;

export const TopHeader = styled.View`
  padding: 20px;
`

export const BlockInfo = styled.View`
  padding: 10px;
  margin: 20px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.backgroundGray200};
  border-radius: 10px;
  flex-direction: row;
  margin-bottom: 20px;
`

export const WrapperAddress = styled.View`
  padding: 10px 20px;
  margin: 10px 0;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.textNormal};
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
`
