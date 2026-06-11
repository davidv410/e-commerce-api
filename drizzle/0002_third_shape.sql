CREATE TABLE "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"description" text,
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;