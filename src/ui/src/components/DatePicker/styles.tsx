import styled from 'styled-components/native';

export const DateContainer = styled.View`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  input {
    border-radius: 20px;
    width: 140px;
    outline: none;
    padding: 10px 15px;
    border-width: 1px;
    border-color: #E9ECEF;
  }

  .react-datepicker__triangle {
    transform: translate(40px, 0px) !important;
  }

`
