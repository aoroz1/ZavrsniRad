import React, { Component } from "react";
import PredmetDataService from "../../services/predmet.service";
import GrupaDataService from "../../services/predmet.service";
import PolaznikDataService from "../../services/polaznik.service";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import { FaTrash } from 'react-icons/fa';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';


export default class PromjeniPredmet extends Component {

  constructor(props) {
    super(props);
   

    

    this.predmet = this.dohvatiPredmet();
    this.promjeniPredmet = this.promjeniPredmet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.grupe = this.dohvatiGrupe();
    this.polaznici = this.dohvatiPolaznici();
    this.obrisiPolaznika = this.obrisiPolaznika.bind(this);
    this.traziPolaznik = this.traziPolaznik.bind(this);
    this.dodajPolaznika = this.dodajPolaznika.bind(this);


    this.state = {
      predmet: {},
      grupe: [],
      polaznici: [],
      sifraGrupa:0,
      pronadeniPolaznici: []
    };
  }




  async dohvatiPredmet() {
    // ovo mora bolje
    //console.log('Dohvaćam predmet');
    let href = window.location.href;
    let niz = href.split('/'); 
    await PredmetDataService.getBySifra(niz[niz.length-1])
    .then(response => {
      this.setState({
        predmet: response.data
      });
     // console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
  }

  

  async promjeniPredmet(predmet) {
    const odgovor = await PredmetDataService.post(predmet);
    if(odgovor.ok){
      // routing na grupe
      window.location.href='/predmeti';
    }else{
      // pokaži grešku
      console.log(odgovor);
    }
  }


  async dohvatiGrupe() {
   // console.log('Dohvaćm grupe');
    await GrupaDataService.get()
      .then(response => {
        this.setState({
          grupe: response.data,
          sifraGrupa: response.data[0].sifra
        });

       // console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  async dohvatiPolaznici() {
    let href = window.location.href;
    let niz = href.split('/'); 
    await PredmetDataService.getPolaznici(niz[niz.length-1])
       .then(response => {
         this.setState({
           polaznici: response.data
         });
 
        // console.log(response.data);
       })
       .catch(e => {
         console.log(e);
       });
   }

   

   async traziPolaznik( uvjet) {

    await PolaznikDataService.traziPolaznik( uvjet)
       .then(response => {
         this.setState({
          pronadeniPolaznici: response.data
         });
 
        // console.log(response.data);
       })
       .catch(e => {
         console.log(e);
       });
   }

   async obrisiPolaznika(predmet, polaznik){
    const odgovor = await PredmetDataService.obrisiPolaznika(predmet, polaznik);
    if(odgovor.ok){
     this.dohvatiPolaznici();
    }else{
     //this.otvoriModal();
    }
   }

   async dodajPolaznika(predmet, polaznik){
    const odgovor = await PredmetDataService.dodajPolaznika(predmet, polaznik);
    if(odgovor.ok){
     this.dohvatiPolaznici();
    }else{
    //this.otvoriModal();
    }
   }
 

  handleSubmit(e) {
    e.preventDefault();
    const podaci = new FormData(e.target);
 
    this.promjeniPredmet({
      naziv: podaci.get('naziv'),
      trajanje: parseInt(podaci.get('trajanje')),
      cijena: parseFloat(podaci.get('cijena')),
      sifraGrupa: this.state.sifraGrupa
    });
    
  }


  render() { 
    const { grupe} = this.state;
    const { predmet} = this.state;
    const { polaznici} = this.state;
    const { pronadeniPolaznici} = this.state;


    const obradiTrazenje = (uvjet) => {
      this.traziPolaznik( uvjet);
    };

    const odabraniPolaznik = (polaznik) => {
      //console.log(predmet.sifra + ' - ' + polaznik[0].sifra);
      if(polaznik.length>0){
        this.dodajPolaznika(predmet.sifra, polaznik[0].sifra);
      }
     
    };

    return (
    <Container>
       
        <Form onSubmit={this.handleSubmit}>
          <Row>
          <Col key="1" sm={12} lg={6} md={6}>
              <Form.Group className="mb-3" controlId="naziv">
                <Form.Label>Naziv</Form.Label>
                <Form.Control type="text" name="naziv" placeholder="" maxLength={255} defaultValue={predmet.naziv}  required/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="grupa">
                <Form.Label>Grupa</Form.Label>
                <Form.Select defaultValue={predmet.sifraGrupa}  onChange={e => {
                  this.setState({ sifraGrupa: e.target.value});
                }}>
                {grupe && grupe.map((grupa,index) => (
                      <option key={index} value={grupa.sifra}>{grupa.naziv}</option>

                ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="trajanje">
                <Form.Label>Trajanje</Form.Label>
                <Form.Control type="text" name="trajanje" defaultValue={predmet.trajanje}  placeholder="130" />
              </Form.Group>


              <Form.Group className="mb-3" controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="text" name="cijena" defaultValue={predmet.cijena}  placeholder="500" />
              </Form.Group>
            



              <Row>
                <Col>
                  <Link className="btn btn-danger gumb" to={`/predmeti`}>Odustani</Link>
                </Col>
                <Col>
                <Button variant="primary" className="gumb" type="submit">
                  Promjeni predmet
                </Button>
                </Col>
              </Row>
          </Col>
          <Col key="2" sm={12} lg={6} md={6} className="polazniciPredmet">
          <Form.Group className="mb-3" controlId="uvjet">
                <Form.Label>Traži polaznika</Form.Label>
                
          <AsyncTypeahead
            className="autocomplete"
            id="uvjet"
            emptyLabel="Nema rezultata"
            searchText="Tražim..."
            labelKey={(polaznik) => `${polaznik.prezime} ${polaznik.ime}`}
            minLength={3}
            options={pronadeniPolaznici}
            onSearch={obradiTrazenje}
            placeholder="dio imena ili prezimena"
            renderMenuItemChildren={(polaznik) => (
              <>
                <span>{polaznik.prezime} {polaznik.ime}</span>
              </>
            )}
            onChange={odabraniPolaznik}
          />
          </Form.Group>
          <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Polaznik</th>
                  
                </tr>
              </thead>
              <tbody>
              {polaznici && polaznici.map((polaznik,index) => (
                
                <tr key={index}>
                  <td > {polaznik.ime} {polaznik.prezime}</td>
                  <td>
                  <Button variant="danger"   onClick={() => this.obrisiPolaznika(predmet.sifra, polaznik.sifra)}><FaTrash /></Button>
                    
                  </td>
                </tr>
                ))
              }
              </tbody>
            </Table>    
          </Col>
          </Row>

          
         
          
        </Form>


      
    </Container>
    );
  }
}

