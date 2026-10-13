import styled, { css } from 'styled-components/native'

export const AccordionSection = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-vertical: 20px;
  border-bottom-color: ${({ theme }: any) => theme.colors.border};
  border-bottom-width: 1px;
`

export const Accordion = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  ${(props: any) => !props.isValid && css`
    opacity: 0.7;
  `}
`

export const ProductInfo = styled.View`
  flex-direction: row;
  background-color: ${({ theme }: any) => theme?.colors?.backgroundGray100};
  border-radius: 10px;
  padding: 5px;
  margin-right: 5px;
`

export const ProductQuantity = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundGray100};
	margin-right: 7px;
	min-width: 32px;
  min-height: 32px;
	align-items: center;
  justify-content: center;
  border-radius: 10px;
`

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`

export const ProductImage = styled.View`
`

export const AccordionContent = styled.View`
`

export const ProductOptionsList = styled.View`

`

export const ProductOption = styled.View``

export const ProductSubOption = styled.View`
  margin-left: 0px;
  flex-direction: row;
  width: 75%;
`

export const ProductComment = styled.View`
  margin-left: 20px;
`

export const QuantityButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`
