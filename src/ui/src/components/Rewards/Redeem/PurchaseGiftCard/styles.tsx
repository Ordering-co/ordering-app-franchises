import styled from 'styled-components/native'

export const Container = styled.View`
  width: 100%;
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  height: 100%;
`

export const GiftCardItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.border};
  margin-bottom: 10px;
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
`
