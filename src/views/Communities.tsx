import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import Button from "../components/Button";
import CategoriesList from "../components/CategoriesList";
import PageContainer from "../components/PageContainer";
import ProfileTab from "../components/ProfileTab";
import SectionSelectTab from "../components/SectionSelectTab";
import ServerCard from "../components/ServerCard";
import { firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import { colors, columnSize } from "../styles/theme";
import firebase from "firebase";
import ListWrapper from "../components/ListWrapper";

const Container = styled(PageContainer)`
  display: grid;
  grid-template-columns: ${columnSize} 1fr;

  > div {
    padding: 2rem;
  }
`;

const GridWrapper = styled.div`
  overflow: hidden auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-auto-rows: min-content;
  gap: 2rem;
`;

const LoadMoreWrapper = styled.div`
  padding-top: 2rem;
  display: grid;
  justify-content: center;
`;

export default function Communities() {
  const [activeCategory, setActiveCategory] = useState("");
  const [serverDocs, setServerDocs] = useState<
    Array<firebase.firestore.DocumentData>
  >([]);
  const [servers, setServers] = useState<any>([]);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      let query;
      if (!activeCategory)
        query = firestore.collection("servers").orderBy("name").limit(10);
      else
        query = firestore
          .collection("servers")
          .where("category", "==", activeCategory)
          .orderBy("name")
          .limit(10);

      const docs = (await query.get()).docs;
      setServerDocs((s) => [...s, ...docs]);
    })();
  }, [activeCategory]);

  useEffect(() => {
    (async () => {
      const sArray: Array<any> = serverDocs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      for (let i = 0; i < sArray.length; i++) {
        const userSnapshots: Array<Promise<any>> = [];
        sArray[i].members.forEach(({ uid }: any) => {
          userSnapshots.push(firestore.collection("users").doc(uid).get());
        });
        const users = await Promise.all(userSnapshots);
        sArray[i].users = users.map((u: any) => u.data());
      }
      setServers(sArray);
    })();
  }, [serverDocs]);

  function handleChange(category: string) {
    if (activeCategory === category) return;

    setServerDocs([]);
    setActiveCategory(category);
  }

  async function handleLoadMore() {
    if (!serverDocs.length) return;

    let query;

    if (!activeCategory)
      query = firestore
        .collection("servers")
        .orderBy("name")
        .startAfter(serverDocs[serverDocs.length - 1])
        .limit(10);
    else
      query = firestore
        .collection("servers")
        .where("category", "==", activeCategory)
        .orderBy("name")
        .startAfter(serverDocs[serverDocs.length - 1])
        .limit(10);

    const docs = (await query.get()).docs;
    setServerDocs([...serverDocs, ...docs]);
  }

  return (
    <Container>
      <ListWrapper
        withSpacers
        style={{ borderRight: `1px solid ${colors.background200}` }}
      >
        <ProfileTab />
        <SectionSelectTab />
        <CategoriesList
          activeCategory={activeCategory}
          onChange={handleChange}
        />
      </ListWrapper>
      <GridWrapper>
        <Grid>
          {servers.length ? (
            servers.map(
              ({ id, name, description, photoURL, members, users }: any) => {
                return (
                  <ServerCard
                    key={id}
                    id={id}
                    name={name}
                    description={description}
                    photoURL={photoURL}
                    joined={Boolean(
                      members.find((m: any) => m.uid === user.auth.uid)
                    )}
                    usersCount={users.length}
                    onlineCount={users.filter((u: any) => u.online).length}
                  />
                );
              }
            )
          ) : (
            <div>No servers found here</div>
          )}
        </Grid>
        <LoadMoreWrapper>
          <Button variant="secondary" onClick={handleLoadMore}>
            Load more
          </Button>
        </LoadMoreWrapper>
      </GridWrapper>
    </Container>
  );
}
