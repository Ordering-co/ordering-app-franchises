import styled from 'styled-components/native'

export const ReviewDriverContainer = styled.ScrollView``

export const DriverPhotoContainer = styled.View`
  margin-vertical: 5px;
  flex-direction: column;
  align-items: center;
`

export const WrapperComments = styled.View`
  flex: 1;
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  margin-bottom: 40px;
`

export const FormReviews = styled.View`
  flex: 1;
  height: 100%;
`

export const RatingBarContainer = styled.View`
  margin-top: 10px;
  margin-bottom: 25px;
`

export const RatingTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`
export const CommentsButtonGroup = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0 40px;
`

export const ActionContainer = styled.View`
  padding: 3px 30px;
`
