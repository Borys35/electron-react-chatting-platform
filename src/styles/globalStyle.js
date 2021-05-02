import { createGlobalStyle } from "styled-components";
import theme from "./theme";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap');

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html, body, #root {
    height: 100vh;
  }

  body {
    background-color: ${theme.colors.background50};
    font-family: ${theme.fontFamilies.body};
    color: ${theme.colors.white};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fontFamilies.heading};
  }
  h1 {
    font-size: 3.5rem;
  }
  h2 {
    font-size: 3rem;
  }
  h3 {
    font-size: 2.5rem;
  }
  h4 {
    font-size: 2rem;
  }
  h5 {
    font-size: 1.5rem;
  }
  h6 {
    font-size: 1rem;
  }
`;

export default GlobalStyle;
