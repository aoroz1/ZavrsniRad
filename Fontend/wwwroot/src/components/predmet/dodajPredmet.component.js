import React, { Component } from "react";
import PredmetDataService from "../../services/predmet.service";
import GrupaDataService from "../../services/grupa.service";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import moment from 'moment';



export default class DodajPredmet extends Component {

  constructor(props) {
    super(props);
    


    this.dodajPredmet = this.dodajPredmet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dohvatiGrupe = this.dohvatiGrupe.bind(this);

    this.state = {
      grupe: [],
      sifraGrupa:0
    };
  }

  componentDidMount() {
    console.log("Dohvaćam grupe");
    this.dohvatiGrupe();
  }

  async dodajPredmet(predmet) {
    const odgovor = await PredmetDataService.post(predmet);
    if(odgovor.ok){
       //routing na grupe
      window.location.href='/predmeti';
    }else{
       //pokaži grešku
      console.log(odgovor);
    }
  }


  async dohvatiGrupe() {

   await GrupaDataService.get()
      .then(response => {
        this.setState({
          grupe: response.data,
          sifraGrupa: response.data[0].sifra
        });

        console.log(response.data);
     })
      .catch(e => {
        console.log(e);
      });
  }


  handleSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
    

    let trajanje=0;
    if (podaci.get('trajanje').trim().length>0){
     trajanje = parseInt(podaci.get('trajanje'))
    }

    this.dodajPredmet({
      naziv: podaci.get('naziv'),
      trajanje: trajanje,
      cijena: parseFloat(podaci.get('cijena')),
      sifraGrupa: this.state.sifraGrupa
    });
    
  }


  render() { 
    const { grupe} = this.state;
    return (
    <Container>
        <Form onSubmit={this.handleSubmit}>


          <Form.Group className="mb-3" controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control type="text" name="naziv" placeholder="" maxLength={255} required/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="grupa">
            <Form.Label>Grupa</Form.Label>
            <Form.Select onChange={e => {
              this.setState({ sifraGrupa: e.target.value});
            }}>
            {grupe && grupe.map((grupa,index) => (
                  <option key={index} value={grupa.sifra}>{grupa.naziv}</option>

            ))}
            </Form.Select>
          </Form.Group>


          <Form.Group className="mb-3" controlId="trajanje">
            <Form.Label>Trajanje</Form.Label>
            <Form.Control type="text" name="trajanje" placeholder="130" />
          </Form.Group>


          <Form.Group className="mb-3" controlId="cijena">
            <Form.Label>Cijena</Form.Label>
            <Form.Control type="text" name="cijena" placeholder="500" />
            <Form.Text className="text-muted">
             Ne smije biti negativna
            </Form.Text>
          </Form.Group>

         



          <Row>
            <Col>
              <Link className="btn btn-danger gumb" to={`/predmeti`}>Odustani</Link>
            </Col>
            <Col>
            <Button variant="primary" className="gumb" type="submit">
              Dodaj predmet
            </Button>
            </Col>
          </Row>
         
          
        </Form>


      
    </Container>
    );
  }
}

