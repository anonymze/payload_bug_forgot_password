import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reservations_desk" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum_app_users_commissions_code_commission_type" AS ENUM('standard', 'bonus', 'special', 'performance');
  CREATE TABLE IF NOT EXISTS "commissions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"app_user_id" uuid NOT NULL,
  	"supplier_id" uuid NOT NULL,
  	"structured_product" boolean,
  	"informations_date" timestamp(3) with time zone,
  	"informations_encours" numeric,
  	"informations_production" numeric,
  	"informations_pdf_id" uuid,
  	"informations_title" varchar,
  	"informations_up_front" numeric,
  	"informations_broqueur" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "commission_imports_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"supplier_id" uuid NOT NULL,
  	"file_id" uuid NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "commission_imports" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "app_users_commissions_code" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"app_user_id" uuid NOT NULL,
  	"code" varchar NOT NULL,
  	"description" varchar,
  	"commission_type" "enum_app_users_commissions_code_commission_type" DEFAULT 'standard' NOT NULL,
  	"commission_rate" numeric NOT NULL,
  	"minimum_amount" numeric,
  	"maximum_amount" numeric,
  	"is_active" boolean DEFAULT true,
  	"valid_from" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "chat_rooms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"app_users_id" uuid
  );
  
  CREATE TABLE IF NOT EXISTS "temporary_app_users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"email" varchar NOT NULL,
  	"role" "enum_app_users_role" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "supplier_categories" DROP CONSTRAINT "supplier_categories_logo_id_media_id_fk";
  
  ALTER TABLE "fidnet" DROP CONSTRAINT "fidnet_video_id_media_id_fk";
  
  DROP INDEX IF EXISTS "supplier_categories_logo_idx";
  DROP INDEX IF EXISTS "fidnet_video_idx";
  ALTER TABLE "admins" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "admins" ADD COLUMN "api_key" varchar;
  ALTER TABLE "admins" ADD COLUMN "api_key_index" varchar;
  ALTER TABLE "reservations" ADD COLUMN "app_user_id" uuid NOT NULL;
  ALTER TABLE "reservations" ADD COLUMN "desk" "enum_reservations_desk" NOT NULL;
  ALTER TABLE "app_users" ADD COLUMN "notifications_token" varchar;
  ALTER TABLE "agency_life" ADD COLUMN "address" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "commissions_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "commission_imports_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "app_users_commissions_code_id" uuid;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "temporary_app_users_id" uuid;
  DO $$ BEGIN
   ALTER TABLE "commissions" ADD CONSTRAINT "commissions_app_user_id_app_users_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "commissions" ADD CONSTRAINT "commissions_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "commissions" ADD CONSTRAINT "commissions_informations_pdf_id_media_id_fk" FOREIGN KEY ("informations_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "commission_imports_files" ADD CONSTRAINT "commission_imports_files_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "commission_imports_files" ADD CONSTRAINT "commission_imports_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "commission_imports_files" ADD CONSTRAINT "commission_imports_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."commission_imports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "app_users_commissions_code" ADD CONSTRAINT "app_users_commissions_code_app_user_id_app_users_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "chat_rooms_rels" ADD CONSTRAINT "chat_rooms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "chat_rooms_rels" ADD CONSTRAINT "chat_rooms_rels_app_users_fk" FOREIGN KEY ("app_users_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "commissions_app_user_idx" ON "commissions" USING btree ("app_user_id");
  CREATE INDEX IF NOT EXISTS "commissions_supplier_idx" ON "commissions" USING btree ("supplier_id");
  CREATE INDEX IF NOT EXISTS "commissions_informations_informations_pdf_idx" ON "commissions" USING btree ("informations_pdf_id");
  CREATE INDEX IF NOT EXISTS "commissions_updated_at_idx" ON "commissions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "commissions_created_at_idx" ON "commissions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "commission_imports_files_order_idx" ON "commission_imports_files" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "commission_imports_files_parent_id_idx" ON "commission_imports_files" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "commission_imports_files_supplier_idx" ON "commission_imports_files" USING btree ("supplier_id");
  CREATE INDEX IF NOT EXISTS "commission_imports_files_file_idx" ON "commission_imports_files" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "commission_imports_updated_at_idx" ON "commission_imports" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "commission_imports_created_at_idx" ON "commission_imports" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "app_users_commissions_code_app_user_idx" ON "app_users_commissions_code" USING btree ("app_user_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "app_users_commissions_code_code_idx" ON "app_users_commissions_code" USING btree ("code");
  CREATE INDEX IF NOT EXISTS "app_users_commissions_code_updated_at_idx" ON "app_users_commissions_code" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "app_users_commissions_code_created_at_idx" ON "app_users_commissions_code" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "chat_rooms_rels_order_idx" ON "chat_rooms_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "chat_rooms_rels_parent_idx" ON "chat_rooms_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "chat_rooms_rels_path_idx" ON "chat_rooms_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "chat_rooms_rels_app_users_id_idx" ON "chat_rooms_rels" USING btree ("app_users_id");
  CREATE INDEX IF NOT EXISTS "temporary_app_users_updated_at_idx" ON "temporary_app_users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "temporary_app_users_created_at_idx" ON "temporary_app_users" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "reservations" ADD CONSTRAINT "reservations_app_user_id_app_users_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_commissions_fk" FOREIGN KEY ("commissions_id") REFERENCES "public"."commissions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_commission_imports_fk" FOREIGN KEY ("commission_imports_id") REFERENCES "public"."commission_imports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_app_users_commissions_code_fk" FOREIGN KEY ("app_users_commissions_code_id") REFERENCES "public"."app_users_commissions_code"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_temporary_app_users_fk" FOREIGN KEY ("temporary_app_users_id") REFERENCES "public"."temporary_app_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "reservations_app_user_idx" ON "reservations" USING btree ("app_user_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_commissions_id_idx" ON "payload_locked_documents_rels" USING btree ("commissions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_commission_imports_id_idx" ON "payload_locked_documents_rels" USING btree ("commission_imports_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_app_users_commissions_code_id_idx" ON "payload_locked_documents_rels" USING btree ("app_users_commissions_code_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_temporary_app_users_id_idx" ON "payload_locked_documents_rels" USING btree ("temporary_app_users_id");
  ALTER TABLE "supplier_categories" DROP COLUMN IF EXISTS "logo_id";
  ALTER TABLE "fidnet" DROP COLUMN IF EXISTS "video_id";
  ALTER TABLE "chat_rooms" DROP COLUMN IF EXISTS "category";
  ALTER TABLE "chat_rooms" DROP COLUMN IF EXISTS "private";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "commissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "commission_imports_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "commission_imports" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "app_users_commissions_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "chat_rooms_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "temporary_app_users" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "commissions" CASCADE;
  DROP TABLE "commission_imports_files" CASCADE;
  DROP TABLE "commission_imports" CASCADE;
  DROP TABLE "app_users_commissions_code" CASCADE;
  DROP TABLE "chat_rooms_rels" CASCADE;
  DROP TABLE "temporary_app_users" CASCADE;
  ALTER TABLE "reservations" DROP CONSTRAINT "reservations_app_user_id_app_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_commissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_commission_imports_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_app_users_commissions_code_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_temporary_app_users_fk";
  
  DROP INDEX IF EXISTS "reservations_app_user_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_commissions_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_commission_imports_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_app_users_commissions_code_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_temporary_app_users_id_idx";
  ALTER TABLE "supplier_categories" ADD COLUMN "logo_id" uuid;
  ALTER TABLE "fidnet" ADD COLUMN "video_id" uuid NOT NULL;
  ALTER TABLE "chat_rooms" ADD COLUMN "category" varchar;
  ALTER TABLE "chat_rooms" ADD COLUMN "private" boolean;
  DO $$ BEGIN
   ALTER TABLE "supplier_categories" ADD CONSTRAINT "supplier_categories_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "fidnet" ADD CONSTRAINT "fidnet_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "supplier_categories_logo_idx" ON "supplier_categories" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "fidnet_video_idx" ON "fidnet" USING btree ("video_id");
  ALTER TABLE "admins" DROP COLUMN IF EXISTS "enable_a_p_i_key";
  ALTER TABLE "admins" DROP COLUMN IF EXISTS "api_key";
  ALTER TABLE "admins" DROP COLUMN IF EXISTS "api_key_index";
  ALTER TABLE "reservations" DROP COLUMN IF EXISTS "app_user_id";
  ALTER TABLE "reservations" DROP COLUMN IF EXISTS "desk";
  ALTER TABLE "app_users" DROP COLUMN IF EXISTS "notifications_token";
  ALTER TABLE "agency_life" DROP COLUMN IF EXISTS "address";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "commissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "commission_imports_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "app_users_commissions_code_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "temporary_app_users_id";
  DROP TYPE "public"."enum_reservations_desk";
  DROP TYPE "public"."enum_app_users_commissions_code_commission_type";`)
}
