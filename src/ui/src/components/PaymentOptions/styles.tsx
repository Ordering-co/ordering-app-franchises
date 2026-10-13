import styled, { css } from 'styled-components/native';

export const PMContainer = styled.ScrollView`
  width: 100%;
  display: flex;
  margin-top: 20px;
`

export const PMList = styled.View`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`

export const PMCardSelected = styled.View`
  padding: 30px 0px 0px;
`

export const PMCardItemContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  font-weight: bold;
`

export const PMItem = styled.TouchableOpacity`
  height: 160px;
  width: 48%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  background-color: ${(props: any) => props.theme.colors.white};
  padding: 10px;
  margin-bottom: 20px;

  ${(props: any) => props.isActive ? css`
    border-width: 1px;
    border-color: ${(props: any) => props.theme.colors.primary};
  ` : css`
    border-width: 1px;
    border-color: ${(props: any) => props.theme.colors.border};
  `}

  ${(props: any) => props.isLoading && css`
    opacity: 0.6;
  `}
`

export const PMPayItem = styled.TouchableOpacity`
  height: 160px;
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
  margin-bottom: 20px;
`
