import styled, { css } from 'styled-components/native'

export const CardInfo = styled.View`
  flex: 1;
  min-height: 85px;
  flex-direction: column;
  justify-content: space-between;
`
export const SoldOut = styled.View`
  position: absolute;
  background: ${(props: any) => props.theme.colors.backgroundGray100} 0% 0% no-repeat padding-box;
  border-radius: 23px;
  padding: 5px 10px;
  top: 25px;
  right: 0px;
`

export const SoldOutOverlay = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
`

export const QuantityContainer = styled.View`
  background: ${({ theme }: any) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  width: 25px;
  height: 25px;
  text-align: center;
  border-radius: 25px;
  align-items: center;
`
export const PricesContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 6px;
`

export const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const LogoWrapper = styled.View`
  position: relative;
  margin-left: ${(props: any) => !props.logoPosition || props.logoPosition === 'right' ? '12px' : '0px'};
  margin-right: ${(props: any) => props.logoPosition === 'right' ? '0px' : '12px'};
`
export const WrapTags = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 10px;
`
export const TagsContainer = styled.View`
    display: flex;
    margin: auto;
`

export const RibbonBox = styled.View`
  position: absolute;
  z-index: 1;
  top: -10px;
  right: -10px;
  background-color: ${(props: any) => props.theme.colors.primary};
  padding: 5px;
  max-width: 80px;
  border-radius: ${(props: any) => props.theme.utils.radius.m}px;

  ${(props: any) => props.bgColor && css`
    background-color: ${props.bgColor};
  `}

  ${(props: any) => props.isRoundRect && css`
    border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  `}

  ${(props: any) => props.isCapsule && css`
    border-radius: 50px;
  `}

  ${(props: any) => props.colorText && css`
    color: ${props.colorText ? 'black' : 'white'};
  `}

  ${(props: any) => props.borderRibbon && css`
    border-width: 1px;
    border-color: ${props.borderRibbon ? 'black' : 'white'};
  `}
`
