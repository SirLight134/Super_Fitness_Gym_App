import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFoodTable1777998779984 implements MigrationInterface {
  name = 'CreateFoodTable1777998779984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."food_mealtype_enum" AS ENUM('breakfast', 'lunch', 'dinner', 'snack')`,
    );
    await queryRunner.query(
      `CREATE TABLE "food" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "calories" integer NOT NULL, "mealType" "public"."food_mealtype_enum" NOT NULL, CONSTRAINT "PK_26d12de4b6576ff08d30c281837" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "food"`);
    await queryRunner.query(`DROP TYPE "public"."food_mealtype_enum"`);
  }
}
