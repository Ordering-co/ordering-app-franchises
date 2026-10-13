import styled, { css } from 'styled-components/native'

export const ListWrapper = styled.View`
  ${(props: any) => props.enableBG && css`
    background-color: ${(props: any) => props.theme.colors.backgroundLight};
  `};
`;
