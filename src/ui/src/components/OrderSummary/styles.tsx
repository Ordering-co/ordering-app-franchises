import styled from 'styled-components/native';

export const OSContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const OSProductList = styled.View``

export const OSBill = styled.View`
  padding: 0px 0px 20px;
`

export const OSTable = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 5px;
`

export const OSTotal = styled.View`
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.backgroundGray200};
  margin-top: 15px;
`

export const OSCoupon = styled.View`
  width: 100%;
  padding: 5px 0px;
`

export const OSRow = styled.View`
  flex-direction: row;
  width: 75%;
`

export const Divider = styled.View`
  border-top-color: ${(props: any) => props.theme.colors.backgroundGray200};
  border-top-width: 1px;
  margin-top: 5px;
  margin-bottom: 10px;
`
