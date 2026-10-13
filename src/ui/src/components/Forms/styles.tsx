import styled, { css } from 'styled-components/native';

export const LoginWith = styled.View`
  width: 100%;
  align-items: flex-start;
`;

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

export const ButtonsWrapper = styled.View`
  margin: 10px 0px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;

  ${(props: any) => props.mBottom && css`
    margin-bottom: ${props.mBottom}px;
  `}
`

export const SocialButtonsStyle = styled.View`
  width: 100%;
  margin: 0px auto 20px;
`

export const SkeletonWrapper = styled.View`
  width: 90%;
`

export const WrapperOrSeparator = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-vertical: 15px;
`

export const Line = styled.View`
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.border};
  flex-grow: 1;
  margin-bottom: 5px;
`
