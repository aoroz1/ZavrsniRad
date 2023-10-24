import React, { Component } from "react";
import PolaznikDataService from "../../services/polaznik.service";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';


export default class Polaznici extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('Bearer');
    if(token==null || token===''){
      window.location.href='/';
    }
    this.dohvatiPolaznici = this.dohvatiPolaznici.bind(this);

    this.state = {
      polaznici: [],
      prikaziModal: false
    };
  }



  otvoriModal = () => this.setState({ prikaziModal: true });
  zatvoriModal = () => this.setState({ prikaziModal: false });

  componentDidMount() {
    this.dohvatiPolaznici();
  }
  dohvatiPolaznici() {
    PolaznikDataService.getAll()
      .then(response => {
        this.setState({
          polaznici: response.data
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  async obrisiPolaznik(sifra){
    
    const odgovor = await PolaznikDataService.delete(sifra);
    if(odgovor.ok){
     this.dohvatiPolaznici();
    }else{
      this.otvoriModal();
    }
    
   }

  render() {
    const { polaznici} = this.state;
    return (

    <Container>
      <a href="/polaznici/dodaj" className="btn btn-success gumb">Dodaj novog polaznika</a>
    <Row>
      { polaznici && polaznici.map((p) => (
           
           <Col key={p.sifra} sm={12} lg={3} md={3}>

              <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={p.slika} />
                <Card.Body>
                  <Card.Title>{p.ime} {p.prezime}</Card.Title>
                  <Card.Text>
                    {p.email}
                  </Card.Text>
                  <Row>
                      <Col>
                      <Link className="btn btn-primary gumb" to={`/polaznici/${p.sifra}`}><FaEdit /></Link>
                      </Col>
                      <Col>
                      <Button variant="danger" className="gumb"  onClick={() => this.obrisiPolaznik(p.sifra)}><FaTrash /></Button>
                      </Col>
                    </Row>
                </Card.Body>
              </Card>
            </Col>
          ))
      }
      </Row>


      <Modal show={this.state.prikaziModal} onHide={this.zatvoriModal}>
              <Modal.Header closeButton>
                <Modal.Title>Greška prilikom brisanja</Modal.Title>
              </Modal.Header>
              <Modal.Body>Polaznik se nalazi na jednoj ili više predmeta i ne može se obrisati.</Modal.Body>
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
