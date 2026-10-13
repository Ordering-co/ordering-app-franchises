import styled from 'styled-components/native'

export const ReviewOrderContainer = styled.ScrollView``

export const WrapperComments = styled.View`
  flex: 1;
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  margin-bottom: 60px;
`

export const FormReviews = styled.View`
  flex: 1;
  height: 100%;
`

export const CommentsButtonGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0 40px;
`
