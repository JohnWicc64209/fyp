const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const Clarifai = require("clarifai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

const clarifaiApp = new Clarifai.App({
  apiKey: "0f251eac1c214600a093e2c312eff651", // Replace with your actual Clarifai API key
});

const storage = multer.diskStorage({
  destination: "./server/uploads", // Ensure the uploads folder exists
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const imagePath = path.join(__dirname, "uploads", req.file.filename);

  try {
    const imageBytes = fs.readFileSync(imagePath, { encoding: "base64" });
    const response = await clarifaiApp.models.predict(Clarifai.GENERAL_MODEL, {
      base64: imageBytes,
    });
    const brand = extractBrandFromResponse(response);
    res.json({ message: "File uploaded successfully", brand });
  } catch (error) {
    console.error("Error identifying brand:", error);
    res.status(500).send({ message: "Error identifying brand" });
  }
});

const extractBrandFromResponse = (response) => {
  const concepts = response.outputs[0].data.concepts;
  const brand = concepts.find((concept) => concept.name === "brand_name"); // Adjust this as needed
  return brand ? brand.name : "Unknown";
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
