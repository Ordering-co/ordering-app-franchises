import styled, { css } from 'styled-components/native'

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 5px;
`

export const IconControl = styled.TouchableOpacity`
  flex-direction: row;
  padding: 10px 0;
  width: 100%;
  align-items: center;
`

export const LeftContent = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  width: 60%;
`

export const QuantityControl = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 62px;
`

export const PositionControl = styled.View`
  flex-direction: row;
  align-items: center;
`

export const Checkbox = styled.TouchableOpacity`
`

export const Circle = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 5px 7px;
  background-color: ${({ theme, active }: any) => active ? theme.colors.primary : theme.colors.backgroundGray100};
  ${({ idx, theme }: any) => idx === 0 && css`
    border-top-left-radius: ${theme.utils.radius.m}px;
    border-bottom-left-radius: ${theme.utils.radius.m}px;
  `}
  ${({ idx, theme }: any) => idx === 2 && css`
    border-top-right-radius: ${theme.utils.radius.m}px;
    border-bottom-right-radius: ${theme.utils.radius.m}px;
  `}
`

export const Logo = styled.View`
  height: 35px;
  width: 35px;
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
`;

export const WrapperOptionName = styled.View`
  flex-direction: column;
  justify-content: flex-start;
`
