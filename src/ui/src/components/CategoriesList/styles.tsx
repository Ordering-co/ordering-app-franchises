import styled from 'styled-components/native';

export const Container = styled.View`
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
`;

export const WrapperCategories = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
`
