import React, { Component } from "react";
import GrupaDataService from "../../services/predmet.service";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import moment from 'moment';


export default class PromjeniGrupa extends Component {

  constructor(props) {
    super(props);
    

   
    this.grupa = this.dohvatiGrupa();
    this.promjeniGrupa = this.promjeniGrupa.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    

    this.state = {
      grupa: {}
    };

  }



  async dohvatiGrupa() {
    let href = window.location.href;
    let niz = href.split('/'); 
    await GrupaDataService.getBySifra(niz[niz.length-1])
      .then(response => {
        let g = response.data;
        g.datumPocetka = moment.utc(g.datumPocetka).format("yyyy-MM-DD");
        
        this.setState({
          grupa: g
        });
       // console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    
   
  }

  async promjeniGrupa(grupa) {
    // ovo mora bolje
    let href = window.location.href;
    let niz = href.split('/'); 
    const odgovor = await GrupaDataService.put(niz[niz.length-1],grupa);
    if(odgovor.ok){
      // routing na grupe
      window.location.href='/grupe';
    }else{
      // pokaži grešku
      console.log(odgovor);
    }
  }



  handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const podaci = new FormData(e.target);
    console.log(podaci.get('datumPocetka'));
    let datum = moment.utc(podaci.get('datumPocetka') );
    console.log(datum);
    //Object.keys(formData).forEach(fieldName => {
    // console.log(fieldName, formData[fieldName]);
    //})
    
    //console.log(podaci.get('verificiran'));
    // You can pass formData as a service body directly:

    this.promjeniGrupa({
      naziv: podaci.get('naziv'),
      datumPocetka: datum,
    });
    
  }


  render() {
    
   const { grupa} = this.state;


    return (
    <Container>
        <Form onSubmit={this.handleSubmit}>


          <Form.Group className="mb-3" controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control type="text" name="naziv" placeholder="Naziv grupe"
            maxLength={255} defaultValue={grupa.naziv} required />
          </Form.Group>



          <Form.Group className="mb-3" controlId="datumPocetka">
                <Form.Label>Datum početka</Form.Label>
                <Form.Control type="date" name="datumPocetka" placeholder="" defaultValue={grupa.datumPocetka}  />
              </Form.Group>


          
         

        
         
          <Row>
            <Col>
              <Link className="btn btn-danger gumb" to={`/grupe`}>Odustani</Link>
            </Col>
            <Col>
            <Button variant="primary" className="gumb" type="submit">
              Promjeni grupu
            </Button>
            </Col>
          </Row>
        </Form>


      
    </Container>
    );
  }
}

