import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfilePictureToUsers1778707136153 implements MigrationInterface {
  name = 'AddProfilePictureToUsers1778707136153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."meals_category_enum" AS ENUM('breakfast', 'lunch', 'dinner')`,
    );
    await queryRunner.query(
      `CREATE TABLE "meals" ("id" SERIAL NOT NULL, "category" "public"."meals_category_enum" DEFAULT 'breakfast', "title" character varying NOT NULL, "description" character varying NOT NULL, "video" character varying NOT NULL, "ingredients" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6f830ac9b463433b58ad6f1a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "profilePictureUrl" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "weight"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "weight" double precision`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "height"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "height" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" ALTER COLUMN "videoUrl" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" ALTER COLUMN "image" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exercises" ALTER COLUMN "image" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" ALTER COLUMN "videoUrl" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "exercises" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "exercises" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "height"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "height" integer`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "weight"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "weight" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "profilePictureUrl"`,
    );
    await queryRunner.query(`DROP TABLE "meals"`);
    await queryRunner.query(`DROP TYPE "public"."meals_category_enum"`);
  }
}
