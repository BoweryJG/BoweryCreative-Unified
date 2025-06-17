import * as React from 'react';
import { CssBaseline, Container, Typography, AppBar, Toolbar, Button } from '@mui/material';

export default function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bowery Creative
          </Typography>
          <Button color="inherit" href="#services">Services</Button>
          <Button color="inherit" href="#work">Work</Button>
          <Button color="inherit" href="#contact">Contact</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Award-Winning Digital Experiences
        </Typography>
        <Typography variant="body1">
          Our React front end is built with Material-UI to showcase cutting edge design. Explore how our AI-driven solutions generate billions in value.
        </Typography>
      </Container>
    </>
  );
}
