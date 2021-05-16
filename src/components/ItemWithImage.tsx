import { FC } from "react";
import styled from "styled-components";
import { colors } from "../styles/theme";
import { Avatar } from "./Avatar";
import IconContainer, { IconProps } from "./IconContainer";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  text: string;
  active?: boolean;
  subtext?: string;
  showStatus?: boolean;
  online?: boolean;
  subIcons?: Array<IconProps>;
}

const Wrapper = styled.div<{ active: boolean; onClick: any }>`
  display: flex;
  align-items: center;
  padding: 0.55em 1em;
  border-radius: 4px;
  text-decoration: none;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "default")};
  background-color: ${({ active }) =>
    active ? colors.background100 : "transparent"};
  color: ${({ active }) => (active ? colors.primary : "unset")};
  font-weight: ${({ active }) => (active ? "bold" : "normal")};

  &:hover {
    background-color: ${colors.background100};
  }
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 1rem;
`;

const Subtext = styled.p`
  color: ${colors.lightGrey};
  font-weight: normal;
  font-size: 0.9em;
  margin-top: 0.4rem;
`;

// const ButtonsWrapper = styled.div`
//   margin-left: auto;

//   > * {
//     margin-right: 0.3rem;

//     &:last-child {
//       margin-right: 0;
//     }
//   }
// `;

const ItemWithImage: FC<Props> = ({
  imageSrc,
  text,
  active = false,
  onClick,
  subtext,
  showStatus,
  online,
  subIcons,
  ...props
}) => {
  return (
    <Wrapper onClick={onClick} active={active} {...props}>
      <StyledAvatar
        size="sm"
        imageSrc={imageSrc}
        showStatus={showStatus}
        online={online}
      />
      <div>
        <p>{text}</p>
        {subtext && <Subtext>{subtext}</Subtext>}
      </div>
      {subIcons && (
        <IconContainer icons={subIcons} style={{ marginLeft: "auto" }} />
      )}
    </Wrapper>
  );
};

export default ItemWithImage;
