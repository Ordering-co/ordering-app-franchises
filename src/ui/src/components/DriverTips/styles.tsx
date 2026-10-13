import styled, { css } from 'styled-components/native'

export const DTContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  padding-bottom: 10px;
`

export const DTWrapperTips = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
`

export const DTCard = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) => props.isActive ? props.theme.colors.primary : props.theme.colors.backgroundGray100};
  text-transform: capitalize;
  min-height: 44px;
  min-width: 44px;
  max-height: 44px;
  margin-right: 10px;
  margin-left: 10px;
  margin-top: 10px;
  padding-horizontal: 10px;

`

export const DTForm = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const DTLabel = styled.Text`
  font-size: ${(props: any) => props.theme.utils.tsize.xs}px;
  color: ${(props: any) => props.theme.colors.disabled};
  align-self: flex-start;

  ${(props: any) => props.theme?.rtl && css`
    margin-left: 20px;
    margin-right: 0;
  `}
`

export const DTWrapperInput = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`
