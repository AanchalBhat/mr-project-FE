import { createMuiTheme } from '@material-ui/core';

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  ...defaultTheme,
  transitions: {
    // So we have `transition: none;` everywhere
    create: () => 'none',
  },
});

export default theme;
