import { FC } from "react";
import styled from "styled-components";
import { colors } from "../styles/theme";
import { Avatar } from "./Avatar";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  text: string;
  active?: boolean;
  subtext?: string;
  showStatus?: boolean;
  online?: boolean;
  buttons?: Array<object>;
}

const Wrapper = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75em 1em;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
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

const ItemWithImage: FC<Props> = ({
  imageSrc,
  text,
  active = false,
  onClick,
  subtext,
  showStatus,
  online,
  buttons,
  ...props
}) => {
  return (
    <Wrapper onClick={onClick} active={active} {...props}>
      <StyledAvatar
        size="md"
        imageSrc={imageSrc}
        showStatus={showStatus}
        online={online}
      />
      <div>
        <p>{text}</p>
        {subtext && <Subtext>{subtext}</Subtext>}
      </div>
      {buttons && (
        <div>
          {buttons.map(({ icon, onClick }: any) => {
            const Icon = icon;
            return <Icon onClick={onClick} />;
          })}
        </div>
      )}
    </Wrapper>
  );
};

export default ItemWithImage;
