import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  > button {
    margin-top: 0.5rem;
  }
`;

export default Form;
