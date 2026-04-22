import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1776686874255 implements MigrationInterface {
  name = 'CreateUsersTable1776686874255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_goal_enum" AS ENUM('gainWeight', 'loseWeight', 'getFitter', 'gainMoreFlexible', 'learnTheBasic')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_activitylevel_enum" AS ENUM('rookie', 'beginner', 'intermediate', 'advance', 'trueBeast')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "password" character varying NOT NULL, "gender" "public"."users_gender_enum" NOT NULL, "phoneNumber" character varying(20), "weight" integer, "height" integer, "goal" "public"."users_goal_enum", "activityLevel" "public"."users_activitylevel_enum" DEFAULT 'beginner', "isActive" boolean NOT NULL DEFAULT true, "isEmailVerified" boolean NOT NULL DEFAULT false, "emailVerifiedAt" TIMESTAMP, "lastLoginAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_activitylevel_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_goal_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
  }
}
