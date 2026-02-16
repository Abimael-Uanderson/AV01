import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Report } from "./Report";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  name!: string;

  @Column("boolean", { default: true })
  isActive!: boolean;

  @OneToMany(() => Report, (report) => report.category)
  reports!: Report[];
}
