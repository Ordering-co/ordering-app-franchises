import { useTheme } from 'styled-components/native'

export const Utils = () => {
  const theme = useTheme()

  const isError = ({
    id,
    errors,
    maxProductQuantity,
    isSoldOut
  }: any) => {
    let bgColor = theme.colors.white;
    if (errors[`id:${id}`]) {
      bgColor = 'rgba(255, 0, 0, 0.05)';
    }
    if (maxProductQuantity <= 0) {
      bgColor = 'hsl(0, 0%, 72%)';
    }
    if (isSoldOut) {
      bgColor = theme.colors.white;
    }
    return bgColor;
  }

  return {
    isError
  }
}
