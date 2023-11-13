import axios from "axios";
//const apiUrl = "http://localhost:8080";
const apiUrl = "https://kanban-backend-sg51.onrender.com";
const makeApiCall = (method, url, payload = null, headers = {}) => {
  const obj = {
    method,
    url: `${apiUrl}${url}`,
    data: payload,
    headers,
  };
  return new Promise((resolve, reject) => {
    axios(obj)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log("Error making API call:", error);
        reject(error);
      });
  });
};

export default makeApiCall;
