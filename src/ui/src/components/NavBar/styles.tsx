import styled, { css } from 'styled-components/native'

export const Wrapper = styled.View`
  background-color: ${(props: any) => props.theme.colors.white};
  flex-direction: row;
  align-items: center;
  position: relative;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0,0,0,0.1);
  height: 50px;
`

export const TitleTopWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ isSubtitle }: any) => isSubtitle ? 'flex-start' : 'center'};
  ${({ onlyLogo }: any) => !onlyLogo && css`
    margin-left: ${({ isSubtitle }: any) => isSubtitle ? '70px' : '20px'};
  `}
  flex: 1;
  width: 100%;
`
