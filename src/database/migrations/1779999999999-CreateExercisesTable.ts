import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExercisesTable1779999999999 implements MigrationInterface {
  name = 'CreateExercisesTable1779999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."exercises_category_enum" AS ENUM('chest', 'arm', 'shoulder', 'back', 'leg', 'abs')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exercises_subcategory_enum" AS ENUM('upperChest', 'middleChest', 'lowerChest', 'biceps', 'triceps', 'forearms', 'frontDelts', 'sideDelts', 'rearDelts', 'lats', 'upperBack', 'lowerBack', 'quads', 'hamstrings', 'glutes', 'calves', 'upperAbs', 'lowerAbs', 'obliques')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."exercises_level_enum" AS ENUM('beginner', 'intermediate', 'advanced')`,
    );
    await queryRunner.query(
      `CREATE TABLE "exercises" ("id" SERIAL NOT NULL, "category" "public"."exercises_category_enum" NOT NULL, "subCategory" "public"."exercises_subcategory_enum" NOT NULL, "title" character varying NOT NULL, "description" text, "videoUrl" character varying, "image" character varying, "level" "public"."exercises_level_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a9bf71f6b7cb2e736ca15582b8c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "exercises"`);
    await queryRunner.query(`DROP TYPE "public"."exercises_level_enum"`);
    await queryRunner.query(`DROP TYPE "public"."exercises_subcategory_enum"`);
    await queryRunner.query(`DROP TYPE "public"."exercises_category_enum"`);
  }
}
