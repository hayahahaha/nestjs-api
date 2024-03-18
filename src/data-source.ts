import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./users/entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "strapiu",
  password: "strongpassword",
  database: "nest",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
})

