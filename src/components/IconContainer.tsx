import React, { FC } from "react";
import styled from "styled-components";

export interface IconProps {
  iconComponent: FC;
  onClick: Function;
  show?: boolean;
}

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  icons: Array<IconProps>;
}

const Wrapper = styled.div`
  > * {
    margin-right: 0.4rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const IconContainer: FC<ComponentProps> = ({ icons, ...props }) => {
  return (
    <Wrapper {...props}>
      {icons.map(({ iconComponent, onClick, show = true }) => {
        if (!show) return null;

        const Icon: any = iconComponent;
        return (
          <Icon onClick={onClick} size={18} style={{ cursor: "pointer" }} />
        );
      })}
    </Wrapper>
  );
};

export default IconContainer;
