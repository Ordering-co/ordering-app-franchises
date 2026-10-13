import styled from 'styled-components/native'

export const ProductCardContainer = styled.TouchableOpacity`
  width: 150px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  margin-bottom: 25px;
  margin-right: 20px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  background-color: ${(props: any) => props.theme.colors.white};
  height: 250px;
`

export const CardInfo = styled.View`
  padding: 10px 10px 0;
`

export const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`

export const LogoWrapper = styled.View`
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`
