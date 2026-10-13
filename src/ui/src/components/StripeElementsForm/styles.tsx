import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  justify-content: space-between;
`

export const ErrorMessage = styled.View`
  color: ${(props: any) => props.theme.colors.cancelColor};
`;
