import http from "../http-common";


class GrupaDataService{

    async get(){
        return await http.get('/Grupa');
    }

    async getBySifra(sifra) {
        return await http.get('/grupa/' + sifra);
      }

    async delete(sifra){
        const odgovor = await http.delete('/Grupa/' + sifra)
        .then(response => {
            return {ok: true, poruka: 'Obrisao uspješno'};
        })
        .catch(e=>{
            return {ok: false, poruka: e.response.data};
        });

        return odgovor;
    }


    async post(grupa){
        //console.log(smjer);
        const odgovor = await http.post('/grupa',grupa)
           .then(response => {
             return {ok:true, poruka: 'Unio grupu'}; // return u odgovor
           })
           .catch(error => {
            //console.log(error.response);
             return {ok:false, poruka: error.response.data}; // return u odgovor
           });
     
           return odgovor;
    }

    async put(sifra,grupa){
        //console.log(grupa);
        const odgovor = await http.put('/grupa/' + sifra,grupa)
           .then(response => {
             return {ok:true, poruka: 'Promjenio grupu'}; // return u odgovor
           })
           .catch(error => {
            //console.log(error.response);
             return {ok:false, poruka: error.response.data}; // return u odgovor
           });
     
           return odgovor;
         }

}

export default new GrupaDataService();