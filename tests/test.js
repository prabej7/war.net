(async () => {
    const response = await fetch("http://192.168.4.1/set-api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        api:"http://192.168.4.4/sync"
      })
    });
  
    const result = await response.text();
    console.log("Server Response:", result);
  })();
  