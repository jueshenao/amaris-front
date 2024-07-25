import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SubscribeFund from './components/SubscribeFund';
import UnsubscribeFund from './components/UnsubscribeFund';
import TransactionHistory from './components/TransactionHistory';

const StyledNav = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[200],
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  margin: theme.spacing(0, 2),
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Navigation = () => (
  <StyledNav>
    <StyledLink to="/subscribe">Subscribe</StyledLink>
    <StyledLink to="/unsubscribe">Unsubscribe</StyledLink>
    <StyledLink to="/transactions">Transactions</StyledLink>
  </StyledNav>
);

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Sistema de Fondos
          </Typography>
        </Toolbar>
        <Navigation />
      </AppBar>
      
      <Container>
        <Routes>
          <Route path="/subscribe" element={<SubscribeFund />} />
          <Route path="/unsubscribe" element={<UnsubscribeFund />} />
          <Route path="/transactions" element={<TransactionHistory />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;