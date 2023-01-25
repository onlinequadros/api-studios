import { MigrationInterface, QueryRunner } from 'typeorm';

export class nomeDaMigration1674574196010 implements MigrationInterface {
  name = 'nomeDaMigration1674574196010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(
      `CREATE TABLE "category" ("id" character varying NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "productstudiophotos" ("id" character varying NOT NULL, "photo" character varying NOT NULL, "feature_photo" boolean, "url" character varying NOT NULL, "low_resolution_image" character varying NOT NULL, "checked" boolean NOT NULL, "visible" boolean NOT NULL DEFAULT true, "order" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_photo_id" character varying, CONSTRAINT "PK_32a391b4e2ee95a25d96fe7d2a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."productstudio_type_enum" AS ENUM('Studio', 'Artista')`,
    );
    await queryRunner.query(
      `CREATE TABLE "productstudio" ("id" character varying NOT NULL, "type" "public"."productstudio_type_enum" NOT NULL, "name" character varying NOT NULL, "category" character varying NOT NULL, "sku_father" character varying NOT NULL, "slug" character varying NOT NULL, "tags" character varying array, "active_deadline" boolean NOT NULL, "deadline" TIMESTAMP, "amount_photos" integer NOT NULL, "amount_extra_photos" integer NOT NULL, "price_extra_photos" character varying NOT NULL, "one_third_photos" integer NOT NULL, "two_third_photos" integer NOT NULL, "full_fotos" integer NOT NULL, "discount_one_third_photos" character varying NOT NULL, "discount_two_third_photos" character varying NOT NULL, "discount_full_photos" character varying NOT NULL, "amount_receivable" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, CONSTRAINT "PK_2b56de115bbac3924a859df208f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_user_type_enum" AS ENUM('client', 'system', 'guest')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying NOT NULL, "name" character varying NOT NULL, "lastname" character varying NOT NULL, "cpf" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "sex" character varying NOT NULL, "birth_date" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "slug" character varying, "forgot_password" character varying, "role" character varying NOT NULL, "permissions" character varying array, "is_active" boolean, "user_type" "public"."users_user_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address_name" character varying NOT NULL, "number" character varying NOT NULL, "district" character varying NOT NULL, "city" character varying NOT NULL, "uf" character varying NOT NULL, "cep" character varying NOT NULL, "complement" character varying, "favorite" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."client_segment_enum" AS ENUM('Studio', 'Artista')`,
    );
    await queryRunner.query(
      `CREATE TABLE "client" ("id" character varying NOT NULL, "name" character varying NOT NULL, "lastname" character varying NOT NULL, "cpf" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "sex" character varying NOT NULL, "birth_date" character varying NOT NULL, "cnpj" character varying, "company_name" character varying, "message_email" character varying, "address" character varying NOT NULL, "number" character varying NOT NULL, "district" character varying NOT NULL, "city" character varying NOT NULL, "uf" character varying NOT NULL, "cep" character varying NOT NULL, "complement" character varying, "segment" "public"."client_segment_enum" NOT NULL, "password" character varying NOT NULL, "login_notification" boolean NOT NULL, "code_access" character varying, "cover" character varying, "validate_access" boolean, "tenant_company" character varying NOT NULL, "role" character varying NOT NULL, "status" character varying, "plan_recurrence" character varying, "plan_id" character varying, "is_active" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e474050210979aca62b9721adcb" UNIQUE ("tenant_company"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "linksharing" ("id" character varying NOT NULL, "studio" character varying NOT NULL, "slug" character varying NOT NULL, "code" character varying NOT NULL, "link" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, CONSTRAINT "PK_3e4593b8ff1b748dd01627630bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders_extra_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" character varying NOT NULL, "sku" character varying NOT NULL, "product_name" character varying NOT NULL, "category" character varying NOT NULL, "price" character varying NOT NULL, "url_image" character varying NOT NULL, "url_cropped" character varying NOT NULL, "type" character varying NOT NULL, "orderIdId" uuid, CONSTRAINT "PK_c40e0d573e82dbfedc8b77478bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" character varying NOT NULL, "sku" character varying NOT NULL, "product_name" character varying NOT NULL, "category" character varying NOT NULL, "price" character varying NOT NULL, "url_image" character varying NOT NULL, "orderIdId" uuid, CONSTRAINT "PK_327be8527e55fae040a4dba998a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_payment_type_enum" AS ENUM('Credit Card', 'Pix')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "user_name" character varying NOT NULL, "receiver_name" character varying NOT NULL, "cpf" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "product_album_name" character varying NOT NULL, "amount_extra_photos" integer NOT NULL, "amount_photos" integer NOT NULL, "payment_type" "public"."orders_payment_type_enum" NOT NULL, "installment" character varying NOT NULL, "subtotal" integer NOT NULL, "discount" integer NOT NULL, "total_amount" integer NOT NULL, "notes" character varying NOT NULL, "salesman" character varying NOT NULL, "shipping_address" character varying NOT NULL, "shipping_method" character varying NOT NULL, "delivery_deadline" character varying NOT NULL, "shipping_value" integer NOT NULL, "external_transaction_id" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders_extra_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" character varying NOT NULL, "sku" character varying NOT NULL, "product_name" character varying NOT NULL, "category" character varying NOT NULL, "price" character varying NOT NULL, "url_image" character varying NOT NULL, "orderIdId" uuid, CONSTRAINT "PK_beca159b4a63968d161987030c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."productartist_type_enum" AS ENUM('Studio', 'Artista')`,
    );
    await queryRunner.query(
      `CREATE TABLE "productartist" ("id" character varying NOT NULL, "type" "public"."productartist_type_enum" NOT NULL, "name" character varying NOT NULL, "category" character varying NOT NULL, "client_user" character varying array, "sku_father" character varying NOT NULL, "slug" character varying NOT NULL, "tags" character varying array, "photo" character varying, "price" character varying NOT NULL, "feature_photo" boolean NOT NULL, "url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cfb995ad7e6d480ae12c9adf604" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "productstudio_users_users" ("productstudioId" character varying NOT NULL, "usersId" character varying NOT NULL, CONSTRAINT "PK_beb368da7c4314f51cff3d00316" PRIMARY KEY ("productstudioId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2a843a969140ff2c573db2b3c8" ON "productstudio_users_users" ("productstudioId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca85190a9de218629499a2cf86" ON "productstudio_users_users" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "productstudiophotos" ADD CONSTRAINT "FK_26bd7c319c7bc65b7a211b4cd35" FOREIGN KEY ("product_photo_id") REFERENCES "productstudio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_extra_items" ADD CONSTRAINT "FK_ef9711957f7a4bcf0672ddede27" FOREIGN KEY ("orderIdId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_photos" ADD CONSTRAINT "FK_95a831accf39a9dfb125f75d359" FOREIGN KEY ("orderIdId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_extra_photos" ADD CONSTRAINT "FK_8a9de1eb3f4df1f954f16386cd6" FOREIGN KEY ("orderIdId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "productstudio_users_users" ADD CONSTRAINT "FK_2a843a969140ff2c573db2b3c89" FOREIGN KEY ("productstudioId") REFERENCES "productstudio"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "productstudio_users_users" ADD CONSTRAINT "FK_ca85190a9de218629499a2cf866" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "productstudio_users_users" DROP CONSTRAINT "FK_ca85190a9de218629499a2cf866"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productstudio_users_users" DROP CONSTRAINT "FK_2a843a969140ff2c573db2b3c89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_extra_photos" DROP CONSTRAINT "FK_8a9de1eb3f4df1f954f16386cd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_photos" DROP CONSTRAINT "FK_95a831accf39a9dfb125f75d359"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders_extra_items" DROP CONSTRAINT "FK_ef9711957f7a4bcf0672ddede27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "productstudiophotos" DROP CONSTRAINT "FK_26bd7c319c7bc65b7a211b4cd35"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca85190a9de218629499a2cf86"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a843a969140ff2c573db2b3c8"`,
    );
    await queryRunner.query(`DROP TABLE "productstudio_users_users"`);
    await queryRunner.query(`DROP TABLE "productartist"`);
    await queryRunner.query(`DROP TYPE "public"."productartist_type_enum"`);
    await queryRunner.query(`DROP TABLE "orders_extra_photos"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_payment_type_enum"`);
    await queryRunner.query(`DROP TABLE "orders_photos"`);
    await queryRunner.query(`DROP TABLE "orders_extra_items"`);
    await queryRunner.query(`DROP TABLE "linksharing"`);
    await queryRunner.query(`DROP TABLE "client"`);
    await queryRunner.query(`DROP TYPE "public"."client_segment_enum"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_user_type_enum"`);
    await queryRunner.query(`DROP TABLE "productstudio"`);
    await queryRunner.query(`DROP TYPE "public"."productstudio_type_enum"`);
    await queryRunner.query(`DROP TABLE "productstudiophotos"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
