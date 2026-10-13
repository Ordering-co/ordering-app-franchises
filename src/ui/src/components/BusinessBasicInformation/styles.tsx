import styled from 'styled-components/native';

export const BusinessContainer = styled.View`
  flex-direction: column;
  margin-top: 20px;
`;

export const BusinessInfo = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  margin-horizontal: ${({ theme }: any) => theme.utils.margins.horizontal}px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  padding: 10px;
`;
export const BusinessInfoItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const BusinessInfoItem2 = styled(BusinessInfoItem)`
  justify-content: space-between;
  width: 100%;
`

export const WrapReviews = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

export const TitleWrapper = styled.View`
  width: 100%;
  flex-direction: column;
`

export const InfoButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.backgroundGray200};
  padding: 5px 15px;
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
`

export const WrapperInfo = styled.View`
  flex-direction: row;
  align-items: center;
`
