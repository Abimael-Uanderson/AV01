import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1771201187391 implements MigrationInterface {
    name = 'InitMigration1771201187391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "update_history" ("id" varchar PRIMARY KEY NOT NULL, "comment" text NOT NULL, "responsible" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "reportId" varchar)`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "location" varchar NOT NULL, "priority" text NOT NULL DEFAULT ('BAIXA'), "status" text NOT NULL DEFAULT ('ABERTA'), "reporterName" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" varchar)`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "isActive" boolean NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "temporary_update_history" ("id" varchar PRIMARY KEY NOT NULL, "comment" text NOT NULL, "responsible" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "reportId" varchar, CONSTRAINT "FK_0bbe1ca8e4614385d61527adebf" FOREIGN KEY ("reportId") REFERENCES "reports" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_update_history"("id", "comment", "responsible", "createdAt", "reportId") SELECT "id", "comment", "responsible", "createdAt", "reportId" FROM "update_history"`);
        await queryRunner.query(`DROP TABLE "update_history"`);
        await queryRunner.query(`ALTER TABLE "temporary_update_history" RENAME TO "update_history"`);
        await queryRunner.query(`CREATE TABLE "temporary_reports" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "location" varchar NOT NULL, "priority" text NOT NULL DEFAULT ('BAIXA'), "status" text NOT NULL DEFAULT ('ABERTA'), "reporterName" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" varchar, CONSTRAINT "FK_7470a830c3002e44860c6aac32c" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reports"("id", "title", "description", "location", "priority", "status", "reporterName", "createdAt", "categoryId") SELECT "id", "title", "description", "location", "priority", "status", "reporterName", "createdAt", "categoryId" FROM "reports"`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`ALTER TABLE "temporary_reports" RENAME TO "reports"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reports" RENAME TO "temporary_reports"`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "location" varchar NOT NULL, "priority" text NOT NULL DEFAULT ('BAIXA'), "status" text NOT NULL DEFAULT ('ABERTA'), "reporterName" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "categoryId" varchar)`);
        await queryRunner.query(`INSERT INTO "reports"("id", "title", "description", "location", "priority", "status", "reporterName", "createdAt", "categoryId") SELECT "id", "title", "description", "location", "priority", "status", "reporterName", "createdAt", "categoryId" FROM "temporary_reports"`);
        await queryRunner.query(`DROP TABLE "temporary_reports"`);
        await queryRunner.query(`ALTER TABLE "update_history" RENAME TO "temporary_update_history"`);
        await queryRunner.query(`CREATE TABLE "update_history" ("id" varchar PRIMARY KEY NOT NULL, "comment" text NOT NULL, "responsible" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "reportId" varchar)`);
        await queryRunner.query(`INSERT INTO "update_history"("id", "comment", "responsible", "createdAt", "reportId") SELECT "id", "comment", "responsible", "createdAt", "reportId" FROM "temporary_update_history"`);
        await queryRunner.query(`DROP TABLE "temporary_update_history"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`DROP TABLE "update_history"`);
    }

}
