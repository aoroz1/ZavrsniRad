import axios from "axios";


export default axios.create({
    baseURL: "https://alenoroz-001-site1.ftempurl.com/api/v1",
    headers: {
        'Content-type': 'application/json',
        
      }
    
    });
    
   
    
