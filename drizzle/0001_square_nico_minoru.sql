ALTER TABLE "MsmeWaitingList" DROP CONSTRAINT "MsmeWaitingList_msme_id_Msme_id_fk";
--> statement-breakpoint
ALTER TABLE "MsmeWaitingList" DROP COLUMN IF EXISTS "msme_id";