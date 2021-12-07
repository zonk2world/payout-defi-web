import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0782ff',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#1b2131',
      contrastText: '#ffffff'
    },
    background: {
      main: '#252D43',
      contrastText: '#ffffff'
    },
    text: {
      main: '#ffffff',
      contrastText: '#000000'
    },
    border: {
      main: '#404D5F',
    }
  }
})

export default theme

