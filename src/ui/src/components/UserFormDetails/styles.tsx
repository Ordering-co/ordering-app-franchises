import styled, { css } from 'styled-components/native';

export const UDForm = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;

  ${({ isCheckout }: any) => isCheckout && css`
    margin-top: 50px;
  `}
`

export const UDWrapper = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
`

export const UDLoader = styled.View`
  width: 100%;
  justify-content: center;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin-top: 0px;
`

export const WrapperPhone = styled.View`
  margin-bottom: 25px;
  width: 100%;

`

export const WrapperBirthdate = styled.View`
  margin-bottom: 25px;
  width: 100%;
  border-width: 1px;
  border-radius: 7.6px;
  align-items: center;
  border-color: ${(props: any) => props.theme.colors.inputBorderColor};
`
