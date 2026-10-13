import styled from 'styled-components/native'

export const Container = styled.ScrollView`
  padding-top: 20px;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const OTabs = styled.ScrollView`
  flex-direction: row;
  width: 100%;
`;

export const OTab = styled.TouchableOpacity`
  margin-right: 15px;
  padding: 5px 10px;
  background-color: ${(props: any) => props.selected ? props.theme.colors.primary : props.theme.colors.backgroundGray100};
  border-radius: ${(props: any) => props.theme.utils.radius.m}px;
`;
