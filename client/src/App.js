import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { UserProvider } from './context/userContext';
import { FlushProvider } from './context/flushContext';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import AuthRoute from './util/AuthRoute';


//Pages
import Home from './pages/Home';
import Auth from './pages/Auth';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#03a9f4',
      contrastText: '#fff'
    },
    secondary: {
      main: '#7f8c8d',
      contrastText: '#fff'
    }
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <UserProvider>
        <FlushProvider>
          <Router>
            <div className='container'>
              <Switch>
                <AuthRoute path='/auth' component={Auth} />
                <Route path='/' component={Home} />
              </Switch>
            </div>
          </Router>
        </FlushProvider>
      </UserProvider>
    </MuiThemeProvider>
  );
}

export default App;
