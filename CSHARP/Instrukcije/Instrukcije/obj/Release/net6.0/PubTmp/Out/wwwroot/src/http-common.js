import axios from "axios";


const axiosInstrukcije = axios.create({
    baseURL: "https://alenoroz-001-site1.ftempurl.com",
    headers: {
        'Content-type': 'application/json',
        
      }
    
    });
    
   
    
export default axiosInstrukcije;