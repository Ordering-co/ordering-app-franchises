import styled from 'styled-components/native'

export const Container = styled.ScrollView`
  flex: 1;
  position: relative;
`

export const AddressSectionListContainer = styled.View`
  padding: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
  margin-bottom: 20px;
`

export const Content = styled.View`
  flex: 1;
  padding: ${(props: any) => props.theme.utils.margins.horizontal}px;
`

export const AddressItem = styled.TouchableOpacity`
  padding: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: ${(props: any) => props.theme.utils.radius.l}px;
`

export const ContainerButtons = styled.View`
  margin-vertical: 50px;
`
