import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import PageContainer from "../components/PageContainer";
import Text from "../components/Text";

const Container = styled(PageContainer)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  max-width: 660px;
`;

const Watermark = styled.h1`
  position: absolute;
  right: 2rem;
  top: 50%;
  opacity: 0.1;
  font-size: 30vw;
  transform: translateY(-50%);
  user-select: none;
  z-index: -1;
`;

export default function NotFound() {
  return (
    <Container>
      <Wrapper>
        <h1 style={{ marginBottom: "1rem" }}>Oops... Page not found</h1>
        <Text size="md" style={{ marginBottom: "2rem" }}>
          If you feel that is a bug, contact the developer. Otherwise just go
          back to home page and try to not get lost again!
        </Text>
        <div>
          <Button as={Link} to="/" size="md" style={{ marginRight: "1em" }}>
            Home
          </Button>
          <Button
            as="a"
            href="mailto:boryskac10@gmail.com"
            variant="secondary"
            size="md"
          >
            Report
          </Button>
        </div>
      </Wrapper>
      <Watermark>404</Watermark>
    </Container>
  );
}
