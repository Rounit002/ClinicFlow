import https from "https";
import fs from "fs";

const url = "https://res.cloudinary.com/dzjzyclid/raw/upload/v1742757989/patients/1/1742757987086-10193763838201003.pdf";
const filePath = "downloaded.pdf";

const file = fs.createWriteStream(filePath);
https.get(url, (response) => {
  response.pipe(file);
  file.on("finish", () => {
    file.close();
    console.log("Download completed. Check the file at:", filePath);
  });
}).on("error", (err) => {
  console.error("Error downloading file:", err);
});