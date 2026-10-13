import styled from 'styled-components/native'

export const Container = styled.ScrollView`
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const TabContainer = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: 40px;
`;

export const Tab = styled.TouchableOpacity`
  margin-right: 15px;
  padding: 5px 10px;
  background-color: ${(props: any) => props.selected ? props.theme.colors.primary : props.theme.colors.backgroundGray100};
  border-radius: ${(props: any) => props.theme.utils.radius.m}px;
`;
