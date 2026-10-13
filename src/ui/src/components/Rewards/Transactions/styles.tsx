import styled from 'styled-components/native'

export const TransactionsContainer = styled.View`
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
`

export const ItemContainer = styled.View`
  flex-direction: column;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const ItemDateBlock = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

export const ItemIcon = styled.View`
  width: 53px;
  height: 53px;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ItemRight = styled.View`
  margin-left: 10px;
`

export const ItemContent = styled.View`
  flex-direction: column;
  justify-content: flex-start;
`

export const ItemText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const ItemDescriptionBlock = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`
