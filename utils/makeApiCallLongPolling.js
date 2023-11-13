import axios from "axios";
const apiUrl = "http://localhost:8080";
//const apiUrl = "https://kanban-backend-sg51.onrender.com";
const makeApiCallLongPolling = async (
  method,
  url,
  payload = null,
  headers = {}
) => {
  return new Promise(async (resolve, reject) => {
    const poll = async () => {
      try {
        console.log("Polling for updates..."); // Add this line
        const response = await axios({
          method,
          url: `${apiUrl}${url}`,
          data: payload,
          headers,
        });

        if (response.data) {
          console.log("Received update:", response.data); // Add this line
          // New data is available, resolve the promise
          resolve(response);
        } else {
          // No new data, continue polling
          setTimeout(poll, 1000); // You can adjust the polling interval
        }
      } catch (error) {
        // Handle errors
        console.error("Polling error:", error); // Add this line
        reject(error);
      }
    };

    // Start the long polling process
    poll();
  });
};

export default makeApiCallLongPolling;
