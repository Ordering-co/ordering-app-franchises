import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
  position: absolute;
  bottom: -25px;
  z-index: ${(props: any) => props.theme.utils.zi.xxl};
`

export const LogoWrapper = styled.View`
  align-items: center;
`;

export const Slogan = styled.View`
  align-items: center;
  margin-bottom: 10px;
`;

export const AltContainer = styled.View`
  width: 100%;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const AlterWrapperActions = styled.View`
  margin-top: 40px;
`
