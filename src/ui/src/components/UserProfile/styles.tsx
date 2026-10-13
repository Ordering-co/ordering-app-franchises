import styled from 'styled-components/native'

export const CenterView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
  width: 100%;
`;

export const HeaderWrapper = styled.View`
  align-items: center;
  margin-bottom: 40px;
`

export const LogoWrapper = styled.View`
  border-radius: 50px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const ListWrap = styled.View`
  flex-grow: 1;
  justify-content: space-between;
  padding-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const Actions = styled.View`
  margin-bottom: 20px;
`

export const WrapperPhone = styled.View`
  padding: 8px 0px;
`

export const ListItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

export const ListItemLeft = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

export const NotificationsWrapper = styled.View`
  position: absolute;
  right: 0;
`

export const NotificationBadge = styled.View`
  width: 10px;
  height: 10px;
  z-index: 2000;
  background-color: ${(props: any) => props.theme.colors.red};
  position: absolute;
  left: -2px;
  top: 3px;
  `;
