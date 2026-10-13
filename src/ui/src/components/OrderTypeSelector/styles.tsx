import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const WrapperMainBtns = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`

export const OTButton = styled.TouchableOpacity`
  height: 50px;
  width: 50%;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: any) => props.theme?.colors?.primary};
  background-color: ${(props: any) => props.selected ? props.theme?.colors?.primary : props.theme?.colors?.white};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;

  ${(props: any) => props.left ? css`
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-right-width: 0;
  ` : css`
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    border-left-width: 0;
  `}

  ${(props: any) => props.isLoading && css`
    opacity: 0.6;
  `}
`

export const WrapperPickupBtns = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const OTMiniButton = styled.TouchableOpacity`
  width: 30%;
  justify-content: center;
  padding-vertical: 5px;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: any) => props.theme?.colors?.backgroundGray100};
  border-radius: ${(props: any) => props.theme.utils.radius.m}px;
  background-color: ${(props: any) => props.selected ? props.theme?.colors?.primary : props.theme?.colors?.backgroundGray100};

  ${(props: any) => props.isLoading && css`
    opacity: 0.6;
  `}
`

export const ListWrapper = styled.View`
  margin-top: 20px;
`;

export const BgImage = styled.ImageBackground`
  width: 100%;
  height: 100px;
`;
export const MaskCont = styled.View`
  justify-content: center;
  padding: 16px 39px;
  background-color: #0000004D;
  height: 100%;
`;

export const OTabs = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: -1px;
  justify-content: space-between;
`;

export const OTab = styled.View`
  padding-bottom: 10px;
  border-bottom-width: 1px;
  padding-horizontal: 10px;
`;

export const TabBtn = styled.TouchableOpacity`
  min-height: 30px;
  height: 30px;
`;
