import styled from 'styled-components/native';

export const CategoryCardContainer = styled.TouchableOpacity`
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
`

export const CategoryCardImg = styled.View`
  border-top-left-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-top-right-radius: ${(props: any) => props.theme.utils.radius.l}px;
`

export const CategoryCardTitle = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: ${(props: any) => props.theme.colors.primary};
  border-bottom-left-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-bottom-right-radius: ${(props: any) => props.theme.utils.radius.l}px;
`
