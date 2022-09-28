import https from "https";

async function post(url: string, options: any, data: any) {
  const dataString = JSON.stringify(data);

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      if (res.statusCode && (res.statusCode < 200 || res.statusCode > 299)) {
        return reject(new Error(`HTTP status code ${res.statusCode}`));
      }

      const body: any[] | Uint8Array[] = [];
      res.on("data", (chunk: any) => body.push(chunk));
      res.on("end", () => {
        const resString = Buffer.concat(body).toString();
        resolve(resString);
      });
    });

    req.on("error", (err: any) => {
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request time out"));
    });

    req.write(dataString);
    req.end();
  });
}

export { post };
