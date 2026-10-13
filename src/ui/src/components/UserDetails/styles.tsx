import styled, { css } from 'styled-components/native';

export const UDContainer = styled.View`
  border-width: 1px;
  border-color: ${({ theme }: any) => theme?.colors?.border};
  padding: 10px;
  border-radius: 10px;
  flex-direction: row;
  align-items: flex-start;
  ${({ isCheckout, isEdit }: any) => isCheckout && css`
    padding: 0px;
    border-width: 0px;
    margin-top: ${!isEdit ? '20px' : '0px'};
  `}
`

export const UDHeader = styled.View`
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
`

export const UDForm = styled.View`
  width: 100%;
  /* margin-top: 25px; */
`

export const UDInfo = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: left;
  padding: 0px 20px 0px 5px;
`
export const EditBtn = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	padding-top: 9px;
	width: 40px;
`;
