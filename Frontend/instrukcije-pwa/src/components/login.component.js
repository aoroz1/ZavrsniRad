import React, { Component } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AutorizacijaDataService from "../services/autorizacija.service";


export default class Login extends Component {


  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.autoriziraj = this.autoriziraj.bind(this);
  }

  async autoriziraj(operater) {
    const odgovor = await AutorizacijaDataService.post(operater);
    console.log(odgovor);
    
    if(odgovor.ok){
      localStorage.setItem('Bearer',odgovor.token);
      window.location.href='/nadzornaploca';
    }else{
     alert(odgovor.poruka);
    }
    
  }
  

  handleSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    this.autoriziraj({
      email: podaci.get('email'),
      lozinka: podaci.get('lozinka')
    });
  }

  render() {
    return (
    
      <Container>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" name="email" placeholder="oper@edunova.hr" maxLength={255} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="lozinka">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control type="password" name="lozinka" />
            </Form.Group>
              <Button variant="primary" className="gumb" type="submit">
                Autoriziraj
              </Button>
          </Form>
      </Container>
          
    );
  }
}
