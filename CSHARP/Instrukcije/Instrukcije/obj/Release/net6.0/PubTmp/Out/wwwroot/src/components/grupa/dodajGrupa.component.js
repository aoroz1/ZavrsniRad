import React, { Component } from "react";
import GrupaDataService from "../../services/predmet.service";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import moment from 'moment';



export default class DodajGrupa extends Component {

  constructor(props) {
    super(props);
    
   
    this.dodajGrupa = this.dodajGrupa.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async dodajGrupa(grupa) {
    const odgovor = await GrupaDataService.post(grupa);
    if(odgovor.ok){
      // routing na grupe
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
    const podaci = new FormData(e.target);
    console.log(podaci.get('datumPocetka'));
    let datum = moment.utc(podaci.get('datumPocetka') );
    console.log(datum);


    // Read the form data
    
    //Object.keys(formData).forEach(fieldName => {
    // console.log(fieldName, formData[fieldName]);
    //})
    
    //console.log(podaci.get('verificiran'));
    // You can pass formData as a service body directly:

   

    this.dodajGrupa({
      naziv: podaci.get('naziv'),
      datumPocetka: datum,
    });
    
  }


  render() { 
    return (
    <Container>
        <Form onSubmit={this.handleSubmit}>


          <Form.Group className="mb-3" controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control type="text" name="naziv" placeholder="Naziv grupe" maxLength={255} required/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="datumPocetka">
            <Form.Label>Datum početka</Form.Label>
            <Form.Control type="date" name="datumPocetka" placeholder=""  />
          </Form.Group>



          

          

          
          

          <Row>
            <Col>
              <Link className="btn btn-danger gumb" to={`/grupe`}>Odustani</Link>
            </Col>
            <Col>
            <Button variant="primary" className="gumb" type="submit">
              Dodaj grupu
            </Button>
            </Col>
          </Row>
         
          
        </Form>


      
    </Container>
    );
  }
}

