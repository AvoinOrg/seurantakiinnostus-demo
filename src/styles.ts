import { createGlobalStyle, css } from 'styled-components';

// try coolors.co
export const Theme: any = {
  color: {
    primary: '#B3E28A',
    secondary: '#DAA89B',
    white: '#fff',
    black: '#000000',
  },
  font: {
    primary: 'Varela Round',
    secondary: 'Lato',
  },
};

export const GlobalStyle: any = createGlobalStyle`
    ${({ theme }: any): any => css`
      @import url('https://fonts.googleapis.com/css?family=Lato|Varela+Round&display=swap');

      body {
        font-family: 'Varela Round', sans-serif;
        font-family: 'Lato', sans-serif;

        font-size: 16px;
        color: ${theme.color.primary};
        background-color: ${theme.color.secondary};
        box-sizing: border-box;
        &:focus {
          outline: 0;
        }
        height: 100%;
        display: flex;
        margin: 0;
        padding: 0;
      }

      html {
        height: 100%;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }

      #root {
        display: flex;
        flex: 1;
      }
    `}`;
