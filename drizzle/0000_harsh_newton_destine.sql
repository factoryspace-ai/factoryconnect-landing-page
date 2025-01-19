CREATE TABLE IF NOT EXISTS "Msme" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"subdomain" varchar(63) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "Msme_subdomain_unique" UNIQUE("subdomain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MsmeWaitingList" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"msme_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"subdomain" varchar NOT NULL,
	"company_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"company_details" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerkId" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"profile_picture" text,
	"bio" text,
	"username" varchar(255),
	"firstName" varchar(255),
	"lastName" varchar(255),
	"email_verified" boolean DEFAULT false,
	"last_sign_in_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "User_clerkId_unique" UNIQUE("clerkId"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserMsme" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"msme_id" uuid NOT NULL,
	"access_level" "access_level" DEFAULT 'employee' NOT NULL,
	"is_default" boolean DEFAULT false,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"invited_by" uuid,
	"status" varchar(20) DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MsmeWaitingList" ADD CONSTRAINT "MsmeWaitingList_msme_id_Msme_id_fk" FOREIGN KEY ("msme_id") REFERENCES "public"."Msme"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MsmeWaitingList" ADD CONSTRAINT "MsmeWaitingList_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserMsme" ADD CONSTRAINT "UserMsme_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserMsme" ADD CONSTRAINT "UserMsme_msme_id_Msme_id_fk" FOREIGN KEY ("msme_id") REFERENCES "public"."Msme"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserMsme" ADD CONSTRAINT "UserMsme_invited_by_User_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
