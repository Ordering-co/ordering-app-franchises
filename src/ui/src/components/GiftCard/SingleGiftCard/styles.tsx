import styled from 'styled-components/native';

export const CardContainer = styled.TouchableOpacity`
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors?.border};
  margin-bottom: 20px;
  padding: 15px;
  padding-horizontal: 20px;
`

export const InnerContainer = styled.View`
  flex-direction: row;
`
