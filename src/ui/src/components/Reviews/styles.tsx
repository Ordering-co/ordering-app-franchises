import styled from 'styled-components/native'

export const Container = styled.View`
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  background-color: ${({ theme }: any) => theme.colors.backgroundGray100};
`

export const BusinessLogo = styled.View`
  align-items: center;
  border-radius: 50px;
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`

export const WrapperMsg = styled.View`
  margin-top: 30px;
`

export const StarRatingContainer = styled.View`
  margin-top: 20px;
  flex-direction: row;
  gap: 20px;
`

export const SkipButton = styled.TouchableOpacity``

export const ActionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 30px;
`
