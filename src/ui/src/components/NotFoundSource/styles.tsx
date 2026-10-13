import styled, { css } from 'styled-components/native'

export const NotFound = styled.View`
  ${(props: any) => props.simple
    ? css`
        background-color: ${(props: any) => props.theme.colors?.white};
        border-radius: ${(props: any) => props.theme.utils.radius.l}px;
        padding: 15px;
        padding-horizontal: 20px;
        border-width: 1px;
        border-color: ${(props: any) => props.theme.colors?.border};
    ` : css`
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 10px;
    `}
`

export const NotFoundImage = styled.View`
  max-width: 300px;
`
