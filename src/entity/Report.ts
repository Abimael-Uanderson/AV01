// entity/Report.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./Category";
import { UpdateHistory } from "./UpdateHistory";

export enum ReportStatus {
  OPEN = "ABERTA",
  PROGRESS = "PROGRESSO",
  RESOLVED = "RESOLVIDA",
  CLOSED = "FECHADA",
  CANCELED = "CANCELADA",
}

export enum Priority {
  LOW = "BAIXA",
  MEDIUM = "MÉDIA",
  HIGH = "ALTA",
}

@Entity("reports")
export class Report {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("varchar")
  title!: string;

  @Column("text")
  description!: string;

  @Column("varchar")
  location!: string;

  @Column({
    type: "text",
    default: Priority.LOW,
  })
  priority!: Priority;

  @Column({
    type: "text",
    default: ReportStatus.OPEN,
  })
  status!: ReportStatus;

  @Column("varchar", { nullable: true })
  reporterName?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Category, (category) => category.reports)
  category!: Category;

  @OneToMany(() => UpdateHistory, (history) => history.report)
  history!: UpdateHistory[];
}
