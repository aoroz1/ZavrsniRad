import React, { Component } from "react";
import { Button, Container, Table } from "react-bootstrap";
import GrupaDataService from "../../services/grupa.service";
import { NumericFormat } from "react-number-format";
import { Link } from "react-router-dom";
import {FaEdit, FaTrash} from "react-icons/fa"
import moment from 'moment';

export default class Grupe extends Component{

    constructor(props){
        super(props);
        
       

        this.state = {
            grupe: []
        };

    }

    componentDidMount(){
        this.dohvatiGrupe();
    }

    async dohvatiGrupe(){

        await GrupaDataService.get()
        .then(response => {
            this.setState({
                grupe: response.data
            });
            console.log(response.data);
        })
        .catch(e =>{
            console.log(e);
        });
    }

    async obrisiGrupa(sifra){
        const odgovor = await GrupaDataService.delete(sifra);
        if(odgovor.ok){
            this.dohvatiGrupe();
        }else{
            alert(odgovor.poruka);
        }
    }


    render(){

        const { grupe } = this.state;

        return (
            <Container>
               <a href="/grupe/dodaj" className="btn btn-success gumb">
                Dodaj novu grupu
               </a>
                
               <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Naziv</th>
                        <th>Datum početka</th>
                        
                    </tr>
                </thead>
                <tbody>
                   { grupe && grupe.map((g,grupa,index) => (

                    <tr key={index}>
                        <td>{grupa.naziv}</td>
                        <td className="broj">
                    {g.datumPocetka==null ? "Nije definirano" :
                    moment.utc(g.datumPocetka).format("DD. MM. YYYY. HH:mm")}
                  </td>
                        
                        <td>
                            <Link className="btn btn-primary gumb"
                            to={`/grupe/${grupa.sifra}`}>
                                <FaEdit />
                            </Link>

                            <Button variant="danger" className="gumb"
                            onClick={()=>this.obrisiGrupa(grupa.sifra)}>
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>

                   ))}
                </tbody>
               </Table>



            </Container>


        );
    }
}