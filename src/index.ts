import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import categoryRoutes from "./routes/categoryRoutes";
import reportRoutes from "./routes/reportRoutes";

const app = express();

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Banco rodando");

    app.use(categoryRoutes);
    app.use(reportRoutes);

    app.listen(3333, () => {
      console.log("Servidor rodando em http://localhost:3333");
    });
  })
  .catch((error) => {
    console.error("Erro ao iniciar:", error);
  });
