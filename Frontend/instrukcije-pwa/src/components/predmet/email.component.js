import React, { Component } from "react";
import PredmetDataService from "../../services/predmet.service";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";




export default class Email extends Component {

  constructor(props) {
    super(props);
    const token = localStorage.getItem('Bearer');
    if(token==null || token===''){
      window.location.href='/';
    }
    this.posalji = this.posalji.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async posalji(email) {
    const odgovor = await GrupaDataService.email(email);
    if(odgovor.ok){
      // routing na smjerovi
      window.location.href='/grupe';
    }else{
      // pokaži grešku
     // console.log(odgovor.poruka.errors);
      let poruke = '';
      for (const key in odgovor.poruka.errors) {
        if (odgovor.poruka.errors.hasOwnProperty(key)) {
          poruke += `${odgovor.poruka.errors[key]}` + '\n';
         // console.log(`${key}: ${odgovor.poruka.errors[key]}`);
        }
      }

      alert(poruke);
    }
  }



  handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const podaci = new FormData(e.target);
    let href = window.location.href;
    let niz = href.split('/'); 

    this.posalji({
      predmet: niz[niz.length-1],
      naslov: podaci.get('naslov'),
      poruka: podaci.get('poruka')
    });
    
  }


  render() { 
    return (
    <Container>
        <Form onSubmit={this.handleSubmit}>


          <Form.Group className="mb-3" controlId="naslov">
            <Form.Label>Naslov</Form.Label>
            <Form.Control type="text" name="naslov" maxLength={255} required/>
          </Form.Group>


          <Form.Group className="mb-3" controlId="poruka">
            <Form.Label>Poruka</Form.Label>
            <Form.Control name="poruka" as="textarea" rows={5} />
          </Form.Group>



          <Row>
            <Col>
              <Link className="btn btn-danger gumb" to={`/grupe`}>Odustani</Link>
            </Col>
            <Col>
            <Button variant="primary" className="gumb" type="submit">
              Pošalji email
            </Button>
            </Col>
          </Row>
         
          
        </Form>


      
    </Container>
    );
  }
}

