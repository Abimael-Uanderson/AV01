import "reflect-metadata";
import { DataSource } from "typeorm";
import { Category } from "./entity/Category";
import { Report } from "./entity/Report";
import { UpdateHistory } from "./entity/UpdateHistory";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: false,
  entities: [Category, Report, UpdateHistory],
  migrations: ["src/migrations/*.ts"],
});
