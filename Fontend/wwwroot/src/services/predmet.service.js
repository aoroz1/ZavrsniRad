import http from "../http-common";

class PredmetDataService {
  getAll() {
    return http.get("/Predmet");
  }

  async getBySifra(sifra) {
   // console.log(sifra);
    return await http.get('/predmet/' + sifra);
  }

  async getPolaznici(sifra) {
    // console.log(sifra);
     return await http.get('/predmet/' + sifra + '/polaznici');
   }
 


  async post(predmet){
    //console.log(predmet);
    const odgovor = await http.post('/predmet',predmet)
       .then(response => {
         return {ok:true, poruka: 'Unio predmet'}; // return u odgovor
       })
       .catch(error => {
        console.log(error.response);
         return {ok:false, poruka: error.response.data}; // return u odgovor
       });
 
       return odgovor;
}




  async delete(sifra){
    
    const odgovor = await http.delete('/predmet/' + sifra)
       .then(response => {
         return {ok:true, poruka: 'Obrisao uspješno'};
       })
       .catch(error => {
         console.log(error);
         return {ok:false, poruka: error.response.data};
       });
 
       return odgovor;
     }

     async obrisiPolaznika(predmet, polaznik){
    
      const odgovor = await http.delete('/predmet/' + predmet + '/obrisi/' + polaznik)
         .then(response => {
           return {ok:true, poruka: 'Obrisao uspješno'};
         })
         .catch(error => {
           console.log(error);
           return {ok:false, poruka: error.response.data};
         });
   
         return odgovor;
       }

       async dodajPolaznika(predmet, polaznik){
    
        const odgovor = await http.post('/predmet/' + predmet + '/dodaj/' + polaznik)
           .then(response => {
             return {ok:true, poruka: 'Dodao uspješno'};
           })
           .catch(error => {
             console.log(error);
             return {ok:false, poruka: error.response.data};
           });
     
           return odgovor;
         }

}
export default new PredmetDataService();

