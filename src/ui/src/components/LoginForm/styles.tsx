import styled, { css } from 'styled-components/native';

export const FormSide = styled.ScrollView`
  flex-direction: column;
`;

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

export const FormInput = styled.View`
  width: 100%;
  flex-direction: column;
  padding: 20px 0px;
`

export const SignupLink = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 20px;
`

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

export const OrSeparator = styled.View`
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const LineSeparator = styled.View`
  width: 40%;
  height: 1px;
  background-color: ${(props: any) => props.theme.colors.disabled};
`

export const SkeletonWrapper = styled.View`
  width: 90%;
`

export const RecaptchaButton = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
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
