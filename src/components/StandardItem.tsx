import { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { colors } from "../styles/theme";
import IconContainer, { IconProps } from "./IconContainer";

interface Props {
  text: string;
  icon?: React.ComponentType;
  to?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  active?: boolean;
  subIcons?: Array<IconProps>;
}

const Wrapper = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.65em 1em;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  background-color: ${({ active }) =>
    active ? colors.background100 : "transparent"};
  color: ${({ active }) => (active ? colors.primary : "unset")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};

  path {
    fill: ${({ active }) => (active ? colors.primary : "unset")};
  }

  &:hover {
    background-color: ${colors.background100};
  }
`;

const StandardItem: FC<Props> = ({
  icon,
  to,
  onClick,
  text,
  active = false,
  subIcons,
  ...props
}) => {
  const Icon: any = icon;

  if (to)
    return (
      <Wrapper as={Link} to={to} active={active} {...props}>
        {icon && <Icon size={24} style={{ marginRight: "1rem" }} />}
        <p>{text}</p>
        {subIcons && (
          <IconContainer icons={subIcons} style={{ marginLeft: "auto" }} />
        )}
      </Wrapper>
    );

  return (
    <Wrapper onClick={onClick} active={active} {...props}>
      {icon && <Icon size={24} style={{ marginRight: "1rem" }} />}
      <p>{text}</p>
      {subIcons && (
        <IconContainer icons={subIcons} style={{ marginLeft: "auto" }} />
      )}
    </Wrapper>
  );
};

export default StandardItem;
