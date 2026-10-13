import styled from 'styled-components/native'

export const Container = styled.ScrollView`
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const SessionsWrapper = styled.View`
  margin-bottom: 40px;
`
export const SessionItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 15px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  border-bottom-width: 1px;
`

export const NoElementContainer = styled.View`
  background-color: ${(props: any) => props.theme.colors?.white};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  padding: 15px;
  padding-horizontal: 20px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors?.border};
`
