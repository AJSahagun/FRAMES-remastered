import axios from "axios"

export const registerUser = async (data:any) => {

const response = axios.post("http://localhost:3001/api/v1/user", data, {
    headers: {
        'x-api-key': "sKxXpu1k2a2g4dwsgwgaJ2zpxsSZORRlfhEQqRkIIDImxM5D2u4xpD9kAor3cXUA4to32GWfAjLHHsvBSmuRYzRN8Xwp53slLiBWFB5zB6VuTMp5QpsgnXrVWHc9JgxP"
    }
})
.then(response => {
    console.log('Success:', response.data);
  })
.catch(error => {
    console.error('Error:', error);
  });
}
