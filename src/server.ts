import "reflect-metadata";
import express from 'express';
import cors from 'cors';

import { router } from "./routes";

const app = express();

app.use(cors());

app.use(router);

const port = process.env.PORT || 3333

app.listen(port, () => console.log(`Server is running on port ${port}!`))