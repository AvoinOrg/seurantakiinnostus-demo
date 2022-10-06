import { Theme, createTheme, ThemeOptions } from '@mui/material/styles';
import { createGlobalStyle, css } from 'styled-components';

declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    palette: Theme['palette'] & {
      colors: any;
    };
    typography: Theme['typography'] & {
      primary: any;
      secondary: any;
    };
  }

  interface CustomThemeOptions extends ThemeOptions {
    palette?: ThemeOptions['palette'] & {
      colors?: any;
    };
    typography?: ThemeOptions['typography'] & {
      primary?: any;
      secondary?: any;
    };
  }

  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

const palette = {
  primary: {
    main: '#B3E28A',
  },
  secondary: {
    main: '#DAA89B',
  },
  colors: {
    white: '#fff',
    black: '#000000',
  },
};

export const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: ['"Varela Round"', 'Lato'].join(','),
    primary: 'Varela Round',
    secondary: 'Lato',
  },
  components: {
    MuiCssBaseline: {
      // for some reason, none of this works. Everything is in app.css
      styleOverrides: `
      @import url('https://fonts.googleapis.com/css?family=Lato|Varela+Round&display=swap');

      body {
        font-family: 'Varela Round', sans-serif;
        font-family: 'Lato', sans-serif;

        font-size: 16px;
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
    `,
    },
  },
  // components: {
  //   MuiCssBaseline: {
  //     styleOverrides: {
  //       html: {
  //         height: '100px',
  //         '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
  //       },
  //     },
  //   },
  // },
});

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
