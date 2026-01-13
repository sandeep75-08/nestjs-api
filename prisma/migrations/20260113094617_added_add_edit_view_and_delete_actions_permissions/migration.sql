-- AlterTable
ALTER TABLE "role_modules" ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canRead" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canUpdate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canWrite" BOOLEAN NOT NULL DEFAULT false;
