import{ Component } from "react";



export default class Odjava extends Component {

  constructor(props) {
    super(props);
   localStorage.setItem('Bearer','');
   window.location.href='/'; 
   }
  
}
