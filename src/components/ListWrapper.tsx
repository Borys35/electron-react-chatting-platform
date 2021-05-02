import styled from "styled-components";

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default ListWrapper;
