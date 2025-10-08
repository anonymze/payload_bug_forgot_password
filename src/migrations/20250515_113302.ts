import {
  MigrateDownArgs,
  MigrateUpArgs,
  sql,
} from "@payloadcms/db-vercel-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en');
  CREATE TYPE "public"."enum_app_users_role" AS ENUM('associate', 'employee', 'independent', 'visitor');
  CREATE TYPE "public"."enum_agency_life_type" AS ENUM('general');
  CREATE TABLE IF NOT EXISTS "admins" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"fullname" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "supplier_categories_offers" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"file_id" uuid NOT NULL,
  	"description" varchar
  );

  CREATE TABLE IF NOT EXISTS "supplier_categories" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "supplier_categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"supplier_products_id" uuid
  );

  CREATE TABLE IF NOT EXISTS "contacts" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"category_id" uuid NOT NULL,
  	"phone" varchar,
  	"website" varchar,
  	"latitude" varchar NOT NULL,
  	"longitude" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "fidnet" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"file_id" uuid NOT NULL,
  	"video_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "suppliers" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"website" varchar,
  	"logo_mini_id" uuid,
  	"logo_full_id" uuid,
  	"brochure_id" uuid,
  	"contact_info_lastname" varchar,
  	"contact_info_firstname" varchar,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"connexion_email" varchar,
  	"connexion_password" varchar,
  	"other_information_theme" varchar,
  	"other_information_annotation" varchar,
  	"other_information_subscription_fee" varchar,
  	"other_information_duration" varchar,
  	"other_information_rentability" varchar,
  	"other_information_rentability_n1" varchar,
  	"other_information_commission" varchar,
  	"other_information_commission_public_offer" varchar,
  	"other_information_commission_offer_group_valorem" varchar,
  	"other_information_scpi" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "fundesys" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"file_id" uuid NOT NULL,
  	"video_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"blurhash" varchar,
  	"prefix" varchar DEFAULT 'media-simply-life',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );

  CREATE TABLE IF NOT EXISTS "reservations_invitations" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "reservations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"day_reservation" timestamp(3) with time zone NOT NULL,
  	"start_time_reservation" timestamp(3) with time zone,
  	"end_time_reservation" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "supplier_products" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "supplier_products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"suppliers_id" uuid
  );

  CREATE TABLE IF NOT EXISTS "contact_categories" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "app_users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"lastname" varchar NOT NULL,
  	"firstname" varchar NOT NULL,
  	"phone" varchar,
  	"photo_id" uuid,
  	"role" "enum_app_users_role" DEFAULT 'independent' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "agency_life" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"annotation" varchar,
  	"type" "enum_agency_life_type" NOT NULL DEFAULT 'general',
  	"event_start" timestamp(3) with time zone NOT NULL,
  	"event_end" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "chat_rooms" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"app_user_id" uuid NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"color" varchar,
  	"category" varchar,
  	"private" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "messages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"app_user_id" uuid NOT NULL,
  	"chat_room_id" uuid NOT NULL,
  	"message" varchar,
  	"file_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "signatures" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"app_user_id" uuid NOT NULL,
  	"file_id" uuid NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"supplier_categories_id" uuid,
  	"contacts_id" uuid,
  	"fidnet_id" uuid,
  	"suppliers_id" uuid,
  	"fundesys_id" uuid,
  	"media_id" uuid,
  	"reservations_id" uuid,
  	"supplier_products_id" uuid,
  	"contact_categories_id" uuid,
  	"app_users_id" uuid,
  	"agency_life_id" uuid,
  	"chat_rooms_id" uuid,
  	"messages_id" uuid,
  	"signatures_id" uuid
  );

  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"app_users_id" uuid
  );

  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  DO $$ BEGIN
   ALTER TABLE "supplier_categories_offers" ADD CONSTRAINT "supplier_categories_offers_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "supplier_categories_offers" ADD CONSTRAINT "supplier_categories_offers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."supplier_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "supplier_categories" ADD CONSTRAINT "supplier_categories_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "supplier_categories_rels" ADD CONSTRAINT "supplier_categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."supplier_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "supplier_categories_rels" ADD CONSTRAINT "supplier_categories_rels_supplier_products_fk" FOREIGN KEY ("supplier_products_id") REFERENCES "public"."supplier_products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "contacts" ADD CONSTRAINT "contacts_category_id_contact_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."contact_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "fidnet" ADD CONSTRAINT "fidnet_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "fidnet" ADD CONSTRAINT "fidnet_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_logo_mini_id_media_id_fk" FOREIGN KEY ("logo_mini_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_logo_full_id_media_id_fk" FOREIGN KEY ("logo_full_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "fundesys" ADD CONSTRAINT "fundesys_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "fundesys" ADD CONSTRAINT "fundesys_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "reservations_invitations" ADD CONSTRAINT "reservations_invitations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "supplier_products_rels" ADD CONSTRAINT "supplier_products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."supplier_products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "supplier_products_rels" ADD CONSTRAINT "supplier_products_rels_suppliers_fk" FOREIGN KEY ("suppliers_id") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "app_users" ADD CONSTRAINT "app_users_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_app_user_id_app_users_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "messages" ADD CONSTRAINT "messages_app_user_id_app_users_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_room_id_chat_rooms_id_fk" FOREIGN KEY ("chat_room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "messages" ADD CONSTRAINT "messages_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "signatures" ADD CONSTRAINT "signatures_app_user_id_app_users_id_fk" FOREIGN KEY ("app_user_id") REFERENCES "public"."app_users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "signatures" ADD CONSTRAINT "signatures_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_supplier_categories_fk" FOREIGN KEY ("supplier_categories_id") REFERENCES "public"."supplier_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fidnet_fk" FOREIGN KEY ("fidnet_id") REFERENCES "public"."fidnet"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_suppliers_fk" FOREIGN KEY ("suppliers_id") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fundesys_fk" FOREIGN KEY ("fundesys_id") REFERENCES "public"."fundesys"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reservations_fk" FOREIGN KEY ("reservations_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_supplier_products_fk" FOREIGN KEY ("supplier_products_id") REFERENCES "public"."supplier_products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_categories_fk" FOREIGN KEY ("contact_categories_id") REFERENCES "public"."contact_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_app_users_fk" FOREIGN KEY ("app_users_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_agency_life_fk" FOREIGN KEY ("agency_life_id") REFERENCES "public"."agency_life"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_chat_rooms_fk" FOREIGN KEY ("chat_rooms_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_signatures_fk" FOREIGN KEY ("signatures_id") REFERENCES "public"."signatures"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_app_users_fk" FOREIGN KEY ("app_users_id") REFERENCES "public"."app_users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "supplier_categories_offers_order_idx" ON "supplier_categories_offers" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "supplier_categories_offers_parent_id_idx" ON "supplier_categories_offers" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "supplier_categories_offers_file_idx" ON "supplier_categories_offers" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "supplier_categories_logo_idx" ON "supplier_categories" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "supplier_categories_updated_at_idx" ON "supplier_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "supplier_categories_created_at_idx" ON "supplier_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "supplier_categories_rels_order_idx" ON "supplier_categories_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "supplier_categories_rels_parent_idx" ON "supplier_categories_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "supplier_categories_rels_path_idx" ON "supplier_categories_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "supplier_categories_rels_supplier_products_id_idx" ON "supplier_categories_rels" USING btree ("supplier_products_id");
  CREATE INDEX IF NOT EXISTS "contacts_category_idx" ON "contacts" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "fidnet_file_idx" ON "fidnet" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "fidnet_video_idx" ON "fidnet" USING btree ("video_id");
  CREATE INDEX IF NOT EXISTS "fidnet_updated_at_idx" ON "fidnet" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "fidnet_created_at_idx" ON "fidnet" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "suppliers_logo_mini_idx" ON "suppliers" USING btree ("logo_mini_id");
  CREATE INDEX IF NOT EXISTS "suppliers_logo_full_idx" ON "suppliers" USING btree ("logo_full_id");
  CREATE INDEX IF NOT EXISTS "suppliers_brochure_idx" ON "suppliers" USING btree ("brochure_id");
  CREATE INDEX IF NOT EXISTS "suppliers_updated_at_idx" ON "suppliers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "suppliers_created_at_idx" ON "suppliers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "fundesys_file_idx" ON "fundesys" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "fundesys_video_idx" ON "fundesys" USING btree ("video_id");
  CREATE INDEX IF NOT EXISTS "fundesys_updated_at_idx" ON "fundesys" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "fundesys_created_at_idx" ON "fundesys" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "reservations_invitations_order_idx" ON "reservations_invitations" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "reservations_invitations_parent_id_idx" ON "reservations_invitations" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "reservations_updated_at_idx" ON "reservations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "reservations_created_at_idx" ON "reservations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "supplier_products_updated_at_idx" ON "supplier_products" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "supplier_products_created_at_idx" ON "supplier_products" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "supplier_products_rels_order_idx" ON "supplier_products_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "supplier_products_rels_parent_idx" ON "supplier_products_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "supplier_products_rels_path_idx" ON "supplier_products_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "supplier_products_rels_suppliers_id_idx" ON "supplier_products_rels" USING btree ("suppliers_id");
  CREATE INDEX IF NOT EXISTS "contact_categories_updated_at_idx" ON "contact_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contact_categories_created_at_idx" ON "contact_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "app_users_photo_idx" ON "app_users" USING btree ("photo_id");
  CREATE INDEX IF NOT EXISTS "app_users_updated_at_idx" ON "app_users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "app_users_created_at_idx" ON "app_users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "app_users_email_idx" ON "app_users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "agency_life_updated_at_idx" ON "agency_life" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "agency_life_created_at_idx" ON "agency_life" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "chat_rooms_app_user_idx" ON "chat_rooms" USING btree ("app_user_id");
  CREATE INDEX IF NOT EXISTS "chat_rooms_updated_at_idx" ON "chat_rooms" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "chat_rooms_created_at_idx" ON "chat_rooms" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "messages_app_user_idx" ON "messages" USING btree ("app_user_id");
  CREATE INDEX IF NOT EXISTS "messages_chat_room_idx" ON "messages" USING btree ("chat_room_id");
  CREATE INDEX IF NOT EXISTS "messages_file_idx" ON "messages" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "signatures_app_user_idx" ON "signatures" USING btree ("app_user_id");
  CREATE INDEX IF NOT EXISTS "signatures_file_idx" ON "signatures" USING btree ("file_id");
  CREATE INDEX IF NOT EXISTS "signatures_updated_at_idx" ON "signatures" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "signatures_created_at_idx" ON "signatures" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_supplier_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("supplier_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fidnet_id_idx" ON "payload_locked_documents_rels" USING btree ("fidnet_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_suppliers_id_idx" ON "payload_locked_documents_rels" USING btree ("suppliers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fundesys_id_idx" ON "payload_locked_documents_rels" USING btree ("fundesys_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_reservations_id_idx" ON "payload_locked_documents_rels" USING btree ("reservations_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_supplier_products_id_idx" ON "payload_locked_documents_rels" USING btree ("supplier_products_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contact_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_app_users_id_idx" ON "payload_locked_documents_rels" USING btree ("app_users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_agency_life_id_idx" ON "payload_locked_documents_rels" USING btree ("agency_life_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_chat_rooms_id_idx" ON "payload_locked_documents_rels" USING btree ("chat_rooms_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_signatures_id_idx" ON "payload_locked_documents_rels" USING btree ("signatures_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_app_users_id_idx" ON "payload_preferences_rels" USING btree ("app_users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins" CASCADE;
  DROP TABLE "supplier_categories_offers" CASCADE;
  DROP TABLE "supplier_categories" CASCADE;
  DROP TABLE "supplier_categories_rels" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "fidnet" CASCADE;
  DROP TABLE "suppliers" CASCADE;
  DROP TABLE "fundesys" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "reservations_invitations" CASCADE;
  DROP TABLE "reservations" CASCADE;
  DROP TABLE "supplier_products" CASCADE;
  DROP TABLE "supplier_products_rels" CASCADE;
  DROP TABLE "contact_categories" CASCADE;
  DROP TABLE "app_users" CASCADE;
  DROP TABLE "agency_life" CASCADE;
  DROP TABLE "chat_rooms" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "signatures" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_app_users_role";
  DROP TYPE "public"."enum_agency_life_type";`);
}
