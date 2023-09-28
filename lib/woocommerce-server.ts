import express from "express";
import axios from "axios";
import cors from "cors";
import {
  woocommerceUrl,
  consumerSecret,
  consumerKey,
} from "./../wc-config.json";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(async (req, res) => {
  try {
    const endpoint = req.originalUrl;

    const response = await axios.request({
      method: req.method,
      url: `${woocommerceUrl}${endpoint}`,
      params: req.query,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
