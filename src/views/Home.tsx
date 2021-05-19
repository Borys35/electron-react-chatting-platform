import React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import ListWrapper from "../components/ListWrapper";
import PageContainer from "../components/PageContainer";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import Text from "../components/Text";
import { colors, columnSize } from "../styles/theme";

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: ${columnSize} 1fr;
  grid-template-rows: 100vh;

  > div {
    padding: 2rem;
  }
`;

const Wrapper = styled.div`
  max-width: 1000px;
  text-align: center;
  place-self: center;

  > * {
    margin-bottom: 2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Subheading = styled.p`
  font-size: 1.5rem;
`;

const userAgent = navigator.userAgent.toLowerCase();
const isElectron = userAgent.indexOf(" electron/") > -1;

export default function Home() {
  return (
    <Container>
      <ListWrapper
        withSpacers
        style={{ borderRight: `1px solid ${colors.background200}` }}
      >
        <ProfileTab />
        <SectionSelectTab />
      </ListWrapper>
      <Wrapper>
        <Subheading>Welcome to</Subheading>
        <h1>Discord Clone</h1>
        <Text size="md">
          Project made for practice purposes with React.js and Electron.js.
          Completely open source and free for everyone. More info on source code
          page.
        </Text>
        <div>
          {!isElectron && (
            <Button size="md" style={{ marginRight: "1em" }}>
              Download
            </Button>
          )}
          <Button
            as="a"
            variant="secondary"
            size="md"
            href="https://github.com/Borys35/electron-react-chatting-platform"
            target="_blank"
          >
            Source code
          </Button>
        </div>
      </Wrapper>
    </Container>
  );
}
