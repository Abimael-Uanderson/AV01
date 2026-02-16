import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Report } from "./Report";

@Entity("update_history")
export class UpdateHistory {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text")
  comment!: string;

  @Column("varchar")
  responsible!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Report, (report) => report.history)
  report!: Report;
}
