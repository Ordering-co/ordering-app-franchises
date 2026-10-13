import styled from 'styled-components/native'

export const AccordionSection = styled.View`
  background: ${({ theme }: any) => theme.colors.backgroundPage};
  width: 100%;
`

export const Accordion = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.border};
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
  padding: 15px;
  margin-bottom: 10px;
`

export const DropdownWrapper = styled.View`
  flex-direction: row;
`
