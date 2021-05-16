import styled from "styled-components";

const InlineForm = styled.form<React.HTMLAttributes<HTMLFormElement>>`
  display: flex;

  input {
    flex: 1;
    margin-right: 1rem;
  }
`;

export default InlineForm;
