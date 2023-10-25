import React, { Component } from "react";
import PredmetDataService from "../../services/predmet.service";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { FaMailBulk } from 'react-icons/fa';

import { Modal } from 'react-bootstrap';
import { NumericFormat } from "react-number-format";

export default class Predmeti extends Component {
  constructor(props) {
    super(props);
   

    
    this.dohvatiPredmeti = this.dohvatiPredmeti.bind(this);

    this.state = {
      grupe: [],
      prikaziModal: false
    };
  }

  otvoriModal = () => this.setState({ prikaziModal: true });
  zatvoriModal = () => this.setState({ prikaziModal: false });


  componentDidMount() {
    this.dohvatiPredmeti();
  }
  dohvatiPredmeti() {
    PredmetDataService.getAll()
      .then(response => {
        this.setState({
          grupe: response.data
        });
      //  console.log(response);
      })
      .catch(e => {
        console.log(e);
      });
  }

  async obrisiPredmet(sifra){
    
    const odgovor = await PredmetDataService.delete(sifra);
    if(odgovor.ok){
     this.dohvatiPredmeti();
    }else{
     this.otvoriModal();
    }
    
   }

  render() {
    const { predmeti} = this.state;
    return (

    <Container>
      <a href="/predmeti/dodaj" className="btn btn-success gumb">Dodaj novi predmet</a>
      <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Trajanje</th>
                  <th>Cijena</th>
                </tr>
              </thead>
              <tbody>
              {predmeti && predmeti.map((predmet,g,index) => (
                
                <tr key={index}>
                  <td> 
                    <p className="naslovGrupa">{g.naziv} ({g.brojPolaznika})</p>
                    {g.predmet}
                  </td>
                  <td className="broj">{predmet.trajanje}</td>
                  <td className="broj">
                      <NumericFormat
                          value={predmet.cijena}
                          displayType={'text'}
                          thousandSeparator='.'
                          decimalSeparator=','
                          prefix={'€'}
                          decimalScale={2} 
                          fixedDecimalScale/>
                  </td>


                  <td>
                    <Row>
                      <Col>
                        <Link className="btn btn-primary gumb" to={`/predmeti/${g.sifra}`}><FaEdit /></Link>
                      </Col>
                      <Col>
                        { g.brojPolaznika===0 &&
                             <Button variant="danger"  className="gumb" onClick={() => this.obrisiPredmet(g.sifra)}><FaTrash /></Button>
                        }
                      </Col>
                      <Col>
                        { g.brojPolaznika>=0 &&
                            <Link className="email" to={"/predmeti/email/" + g.sifra}> <FaMailBulk /> </Link>
                        }
                      </Col>
                    </Row>
                    
                  </td>
                </tr>
                ))
              }
              </tbody>
            </Table>     

             <Modal show={this.state.prikaziModal} onHide={this.zatvoriModal}>
              <Modal.Header closeButton>
                <Modal.Title>Greška prilikom brisanja</Modal.Title>
              </Modal.Header>
              <Modal.Body>Predmet ima polaznike.</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.zatvoriModal}>
                  Zatvori
                </Button>
              </Modal.Footer>
            </Modal>

    </Container>


    );
    
        }
}
