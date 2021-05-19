import styled from "styled-components";
import theme from "../styles/theme";

const ListWrapper = styled.div<{ withSpacers?: boolean }>`
  display: flex;
  flex-direction: column;

  > * {
    padding-bottom: ${({ withSpacers }) => (withSpacers ? "1.5rem" : "")};
    border-bottom: ${({ withSpacers }) =>
      withSpacers ? `1px solid ${theme.colors.background200}` : `none`};
    margin-bottom: ${({ withSpacers }) => (withSpacers ? "1.5rem" : "0.5rem")};
    &:last-child {
      margin-bottom: 0;
      border-bottom: 0;
      padding-bottom: ${({ withSpacers }) => (withSpacers ? "0" : "")};
    }
  }
`;

export default ListWrapper;
