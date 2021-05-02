import React from "react";
import styled from "styled-components";
import PageContainer from "../components/PageContainer";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import { colors } from "../styles/theme";

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: max(240px, 20vw) 1fr;

  > div {
    padding: 2rem;
  }
`;

export default function Communities() {
  return (
    <Container>
      <div style={{ borderRight: `1px solid ${colors.background200}` }}>
        <ProfileTab />
        <SectionSelectTab />
      </div>
      <div>Communities are not supported yet!</div>
    </Container>
  );
}
