ALTER TABLE "product_images" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "product_images" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "created_at" timestamp DEFAULT now();