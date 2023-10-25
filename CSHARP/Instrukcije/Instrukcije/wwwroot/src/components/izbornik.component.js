import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../logo3.svg';


export default class Izbornik extends Component{

 
 
  render() {
  //  console.log(autoriziran);

    return (
    
      <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
      <Navbar.Brand href="/"><img src={logo} className="App-logo" alt="logo" /> Instrukcije APP</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Nav.Link href="/nadzornaploca">Nadzorna ploča</Nav.Link>
            <NavDropdown title="Programi" id="basic-nav-dropdown">
              <NavDropdown.Item href="/grupe">Grupe</NavDropdown.Item>
              <NavDropdown.Item href="/polaznici">Polaznici</NavDropdown.Item>
              <NavDropdown.Item href="/predmeti">Predmeti</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link target="_blank" href="https://alenoroz-001-site1.ftempurl.com/swagger/index.html">API dokumentacija</Nav.Link>
          </Nav>   
          </Navbar.Collapse>
         

        
      </Container>
    </Navbar>
          


    );
  }
}
