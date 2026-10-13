import styled from 'styled-components/native'

export const CategoriesContainer = styled.ScrollView`
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const CategoryItem = styled.TouchableOpacity`
  align-items: center;
  background-color: ${(props: any) => props.selected ? props.theme.colors.primary : props.theme.colors.backgroundGray100};
  border-radius: ${(props: any) => props.theme.utils.radius.m}px;
  padding: 5px 10px;
  margin-right: 15px;
  position: relative;
  overflow: hidden;
`

export const CategoryItemBottom = styled.TouchableOpacity`
  padding: 10px 0;
  margin: 0 ${(props: any) => props.theme.utils.margins.horizontal}px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.backgroundGray200};
  position: relative;
`
