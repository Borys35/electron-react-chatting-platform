import React, { FC, MutableRefObject, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import styled from "styled-components";
import Input from "./Input";

const Wrapper = styled.div``;

const HiddenInput = styled.input`
  display: none;
`;

const StyledInput = styled(Input)`
  position: relative;
  width: 2em;
  height: 2em;
`;

const Icon = styled(FaCheck)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Checkbox = React.forwardRef<HTMLInputElement>((props, ref) => {
  const [checked, setChecked] = useState(false);
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (!checkboxRef.current) return;

    checkboxRef.current.click();
    setChecked(checkboxRef.current.checked);
  };

  return (
    <>
      <HiddenInput
        ref={(node) => {
          checkboxRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="checkbox"
        checked={checked}
        {...props}
      />
      <StyledInput as="div" onClick={handleClick}>
        {checked && <Icon />}
      </StyledInput>
    </>
  );
});

export default Checkbox;
