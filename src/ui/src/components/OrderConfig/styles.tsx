import styled from 'styled-components/native'

export const BlockInfo = styled.View`
  padding: 10px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme?.colors?.backgroundGray200};
  border-radius: 10px;
  flex-direction: row;
  margin-bottom: 10px;
`
