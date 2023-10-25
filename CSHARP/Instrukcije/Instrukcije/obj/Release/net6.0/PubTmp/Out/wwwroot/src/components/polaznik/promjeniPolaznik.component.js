import React, { Component } from "react";
import PolaznikDataService from "../../services/polaznik.service";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from "react-router-dom";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Image } from "react-bootstrap";




export default class PromjeniPolaznik extends Component {




  constructor(props) {
    super(props);
    

    
    this.polaznik = this.dohvatiPolaznik();
    this.promjeniPolaznik = this.promjeniPolaznik.bind(this);
    this.spremiSliku = this.spremiSliku.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    


    this.state = {
      polaznik: {},
      trenutnaSlika: ""
    };
  }


  async dohvatiPolaznik() {
    // ovo mora bolje
    let href = window.location.href;
    let niz = href.split('/'); 
    await PolaznikDataService.getBySifra(niz[niz.length-1])
      .then(response => {
        this.setState({
          polaznik: response.data,
          trenutnaSlika: response.data.slika
        });
       // console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  async promjeniPolaznik(polaznik) {
    // ovo mora bolje
    let href = window.location.href;
    let niz = href.split('/'); 
    const odgovor = await PolaznikDataService.put(niz[niz.length-1],polaznik);
    if(odgovor.ok){
      window.location.href='/polaznici';
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
    //Object.keys(formData).forEach(fieldName => {
    // console.log(fieldName, formData[fieldName]);
    //})
    
    //console.log(podaci.get('verificiran'));
    // You can pass formData as a service body directly:

    this.promjeniPolaznik({
      ime: podaci.get('ime'),
      prezime: podaci.get('prezime'),
      oib: podaci.get('oib'),
      email: podaci.get('email')
    });
    
  }

    _crop() {
        // image in dataUrl
       // console.log(this.cropper.getCroppedCanvas().toDataURL());
       this.setState({
        slikaZaServer: this.cropper.getCroppedCanvas().toDataURL()
      });
    }

    onCropperInit(cropper) {
        this.cropper = cropper;
    }

    onChange = (e) => {
      e.preventDefault();
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
          image: reader.result
        });
      };
      try {
        reader.readAsDataURL(files[0]);
      } catch (error) {
        
      }
      
    }


    spremiSlikuAkcija = () =>{
      const { slikaZaServer} = this.state;
      const { polaznik} = this.state;

      

      this.spremiSliku(polaznik.sifra,slikaZaServer); 
    };


    async spremiSliku(sifra,slika){

      let base64 = slika;
      base64=base64.replace('data:image/png;base64,', '');

      const odgovor = await  PolaznikDataService.postaviSliku(sifra,{
        base64: base64
      });
    if(odgovor.ok){
      //window.location.href='/polaznici';
      this.setState({
        trenutnaSlika: slika
      });
    }else{
      // pokaži grešku
      console.log(odgovor);
    }

    }
  
  render() {
    
    const { polaznik} = this.state;
    const { image} = this.state;
    const { slikaZaServer} = this.state;
    const { trenutnaSlika} = this.state;

    return (
    <Container>
        <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col key="1" sm={12} lg={6} md={6}>
              <Form.Group className="mb-3" controlId="ime">
                <Form.Label>Ime</Form.Label>
                <Form.Control type="text" name="ime" placeholder="Josip" maxLength={255} defaultValue={polaznik.ime} required/>
              </Form.Group>


              <Form.Group className="mb-3" controlId="prezime">
                <Form.Label>Prezime</Form.Label>
                <Form.Control type="text" name="prezime" placeholder="Horvat" defaultValue={polaznik.prezime}  required />
              </Form.Group>


              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" name="email" placeholder="jhorvat@edunova.hr" defaultValue={polaznik.email}  />
              </Form.Group>

              <Form.Group className="mb-3" controlId="oib">
                <Form.Label>OIB</Form.Label>
                <Form.Control type="text" name="oib" placeholder="" defaultValue={polaznik.ime}  />
              </Form.Group>
              
              <Row>
              <Col key="1" sm={12} lg={6} md={6}>
                Trenutna slika<br />
                <Image src={trenutnaSlika} className="slika"/>
                </Col>
                <Col key="2" sm={12} lg={6} md={6}>
                  Nova slika<br />
                <Image src={slikaZaServer} className="slika"/>
                </Col>
              </Row>

            </Col>
            <Col key="2" sm={12} lg={6} md={6}>
            <input type="file" onChange={this.onChange} />

             <input type="button" onClick={this.spremiSlikuAkcija} value={"Spremi sliku"} />

                <Cropper
                    src={image}
                    style={{ height: 400, width: "100%" }}
                    initialAspectRatio={1}
                    guides={true}
                    viewMode={1}
                    minCropBoxWidth={50}
                    minCropBoxHeight={50}
                    cropBoxResizable={false}
                    background={false}
                    responsive={true}
                    checkOrientation={false} 
                    crop={this._crop.bind(this)}
                    onInitialized={this.onCropperInit.bind(this)}
                />
        
            </Col>
            </Row>

       

          
         
          <Row>
            <Col>
              <Link className="btn btn-danger gumb" to={`/polaznici`}>Odustani</Link>
            </Col>
            <Col>
            <Button variant="primary" className="gumb" type="submit">
              Promjeni polaznika
            </Button>
            </Col>
          </Row>
        </Form>


      
    </Container>
    );
  }
}

