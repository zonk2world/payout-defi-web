import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0782ff',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#f4f4f7',
      contrastText: '#000000'
    },
    background: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    text: {
      main: '#000000',
      contrastText: '#ffffff'
    },
    border: {
      main: '#CFD8DC',
    }
  }
})

export default theme
