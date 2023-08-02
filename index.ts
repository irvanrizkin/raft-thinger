require('dotenv').config();
import express, { Request, Response } from "express";
import cors from 'cors'

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json(
    {
      status: true,
      message: 'Welcome to the main endpoint of RAFT Thinger',
    }
  )
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API for Thinger running in port ${PORT}`);
});
