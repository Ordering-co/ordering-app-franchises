import styled, { css } from 'styled-components/native'

export const Container = styled.TouchableOpacity`
  width: 100%;
  display: flex;
  padding: 20px 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.backgroundGray200};
  ${(props: any) => props.isBottomBorder && css`
    border-bottom-width: 1px;
    border-bottom-color: ${(props: any) => props.theme.colors.backgroundGray200};
  `}
`

export const SectionLeft = styled.View`
  width: 55%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`

export const SectionRight = styled.View`
  max-width: 35%;
  align-items: flex-end;
`
