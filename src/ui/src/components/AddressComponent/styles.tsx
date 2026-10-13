import styled from 'styled-components/native'

export const WrapperAddress = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px ${(props: any) => props.theme.utils.margins.horizontal}px;
  background-color: ${({ theme }: any) => theme.colors.backgroundGray100};
  width: 100%;
`

export const WraperOptions = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  max-width: 80%;
`
