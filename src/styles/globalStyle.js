import { createGlobalStyle } from "styled-components";
import theme from "./theme";

const GlobalStyle = createGlobalStyle`
  // @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

  ::-webkit-scrollbar {
    width: 8px;               /* width of the entire scrollbar */
  }

  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.background200};    /* color of the scroll thumb */
    border-radius: 24px;       /* roundness of the scroll thumb */
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    scrollbar-color: ${theme.colors.background200} transparent;
    scrollbar-width: thin;
  }

  :root {
    font-size: 15px;
    overflow: hidden;
  }

  html, body, #root {
    height: 100vh;
  }

  body {
    background-color: ${theme.colors.background50};
    font-family: ${theme.fontFamilies.body};
    color: ${theme.colors.white};
  }

  textarea { 
    font-family: ${theme.fontFamilies.body};
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
    font-size: 1.25rem;
  }

  a {
    text-decoration: none;
    color: ${theme.colors.primary};
  }

  .ReactModal {
    &__Body {

    }
    &__Overlay {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: ${theme.colors.black}CC;
      opacity: 0;
      transition: opacity .2s ease-in-out;

      &--after-open {
        opacity: 1;
      }

      &--before-close {
        opacity: 0;
      }
    }
    &__Content {
      -webkit-overflow-scrolling: touch;
      position: absolute;
      background-color: ${theme.colors.background50};
      border: 1px solid ${theme.colors.background200};
      border-radius: 4px;
      outline: none;
      overflow: auto;
      padding: 1.5rem;
      top: 50%;
      left: 50%;
      min-height: 100px;
      min-width: 200px;
      transform: translate(-50%, -50%);

      /* transform: scale(.8);
      transition: transform .2s ease-in-out;

      &--after-open {
        transform: scale(1);
      }

      &--before-close {
        transform: scale(.8);
      } */
    }
  }

  @media (max-width: 1000px) {
    :root {
      font-size: 14px;
    }
  }
`;

export default GlobalStyle;
