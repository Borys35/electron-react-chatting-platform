import React from "react";
import styled from "styled-components";
import Button from "../components/Button";
import ListWrapper from "../components/ListWrapper";
import PageContainer from "../components/PageContainer";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import Text from "../components/Text";
import { colors, columnSize } from "../styles/theme";
import logo from "../assets/logo.svg";

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

const Logo = styled.img`
  @keyframes movement {
    from {
      top: 0;
    }
    to {
      top: -20px;
    }
  }

  position: relative;
  width: 100%;
  max-width: 250px;
  animation: movement 1s ease-in-out infinite alternate;
  transition: transform 0.75s;

  &:hover {
    transform: rotate(180deg);
  }
`;

const userAgent = navigator.userAgent.toLowerCase();
const isElectron = userAgent.indexOf(" electron/") > -1;
const isMobile = userAgent.match("/mobile/i");
const isWindows = userAgent.indexOf("windows") > -1;
const is64bit =
  userAgent.indexOf("wow64") > -1 || userAgent.indexOf("win64") > -1;

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
        <Logo src={logo} alt="Logo" />
        <h4>
          Welcome to <u>Realtime Chat JS</u>
        </h4>
        <Text size="md">
          Project made for practice purposes with React.js and Electron.js.
          Completely open source and free for everyone. More info on source code
          page.
        </Text>
        <div>
          {!isElectron &&
            !isMobile &&
            (isWindows ? (
              is64bit ? (
                <Button
                  as="a"
                  href="rtcjs-win64.zip"
                  download="Realtime_Chat_JS_Win64.zip"
                  size="md"
                  style={{ marginRight: "1em" }}
                >
                  Download for Windows 64-bit
                </Button>
              ) : (
                <Button
                  as="a"
                  href="rtcjs-win32.zip"
                  download="Realtime_Chat_JS_Win32.zip"
                  size="md"
                  style={{ marginRight: "1em" }}
                >
                  Download for Windows 32-bit
                </Button>
              )
            ) : (
              <Button
                as="a"
                href="rtcjs-linux.zip"
                download="Realtime_Chat_JS_Linux.zip"
                size="md"
                style={{ marginRight: "1em" }}
              >
                Download for Linux
              </Button>
            ))}
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
