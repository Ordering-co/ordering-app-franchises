import styled from 'styled-components/native'

export const PromotionsContainer = styled.View`
  width: 100%;
  padding: 0 20px;
`

export const SingleOfferContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.border};
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
  padding: 20px 10px;
`

export const OfferInformation = styled.View`
  justify-content: space-between;
  min-width: ${({ width }: any) => width || '70%'};
  max-width: ${({ width }: any) => width || '70%'};
`

export const SearchBarContainer = styled.View`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 20px;
`

export const SingleBusinessOffer = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.border};
  border-radius: ${({ theme }: any) => theme.utils.radius.l}px;
  padding: 10px;
`

export const AvailableBusinesses = styled.View`
  flex-direction: row;
  overflow: hidden;
`

export const OfferData = styled.View`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`

export const Code = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`

export const ValueOfOffer = styled.View``

export const BusinessInfo = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`
