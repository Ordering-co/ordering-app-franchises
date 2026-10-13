import styled from 'styled-components/native'

export const Container = styled.View`
  margin-top: 20px;
  margin-horizontal: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const ProductWrapper = styled.View`
  display: flex;
  margin-right: 20px;
  padding-top: 30px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: stretch;
`
