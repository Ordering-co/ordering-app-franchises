import styled, { css } from 'styled-components/native'

export const AccordionSection = styled.View`
  background: #FFF;
  padding-top: 20px;
`

export const Accordion = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ${(props: any) => !props.isValid && css`
    opacity: 0.7;
  `}
`

export const WrapperCard = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 10px;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors?.border};
`

export const WrapperFooterCard = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const ProductInfo = styled.View`
  flex-direction: row;
  padding-top: 10px;
  justify-content: space-evenly;
  width: 95px;
`

export const ContentInfo = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

export const AccordionContent = styled.View`
`

export const ProductOptionsList = styled.View``

export const ProductOption = styled.View``

export const ProductSubOption = styled.View`
  margin-left: 0px;
  flex-direction: row;
  width: 75%;
`
