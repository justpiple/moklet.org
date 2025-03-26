-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SuperAdmin', 'Admin', 'OSIS', 'MPK', 'BDI', 'PALWAGA', 'PASKATEMA', 'TSBC', 'TSFC', 'TSVC', 'TSCC', 'PMR', 'MEMO', 'MAC', 'METIC', 'COMET', 'DA', 'Guest');

-- CreateEnum
CREATE TYPE "UnitSekolah" AS ENUM ('HUBIN', 'KURIKULUM', 'KESISWAAN', 'SARPRA', 'ISO', 'TU', 'GURU', 'SATPAMCS');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('User', 'System');

-- CreateEnum
CREATE TYPE "Field_Type" AS ENUM ('text', 'number', 'email', 'password', 'longtext', 'radio', 'checkbox');

-- CreateEnum
CREATE TYPE "Organisasi_Type" AS ENUM ('OSIS', 'MPK', 'BDI', 'PALWAGA', 'PASKATEMA', 'TSBC', 'TSFC', 'TSVC', 'PMR', 'MEMO', 'MAC', 'METIC', 'COMET', 'PUSTEL', 'DA');

-- CreateEnum
CREATE TYPE "TwibbonType" AS ENUM ('PHOTO', 'VIDEO');

-- CreateTable
CREATE TABLE "User" (
    "user_id" CHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'Guest',
    "user_pic" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "User_Auth" (
    "userauth_id" CHAR(36) NOT NULL,
    "password" TEXT,
    "last_login" TIMESTAMP(3),
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "User_Auth_pkey" PRIMARY KEY ("userauth_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "post_id" CHAR(36) NOT NULL,
    "title" TEXT NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "reaction" JSONB NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tagName" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tagName")
);

-- CreateTable
CREATE TABLE "Form" (
    "form_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "allow_edit" BOOLEAN NOT NULL DEFAULT false,
    "submit_once" BOOLEAN NOT NULL DEFAULT true,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "open_at" TIMESTAMP(3),
    "close_at" TIMESTAMP(3),

    CONSTRAINT "Form_pkey" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "Field" (
    "field_id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "type" "Field_Type" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "form_id" TEXT NOT NULL,
    "fieldNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("field_id")
);

-- CreateTable
CREATE TABLE "Field_Option" (
    "field_option_id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "field_id" INTEGER NOT NULL,

    CONSTRAINT "Field_Option_pkey" PRIMARY KEY ("field_option_id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "submission_id" CHAR(36) NOT NULL,
    "form_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submission_id")
);

-- CreateTable
CREATE TABLE "Submission_Field" (
    "submission_field_id" CHAR(36) NOT NULL,
    "submission_id" TEXT NOT NULL,
    "field_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Submission_Field_pkey" PRIMARY KEY ("submission_field_id")
);

-- CreateTable
CREATE TABLE "Link_Shortener" (
    "slug" VARCHAR(50) NOT NULL,
    "target_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "password" CHAR(32),
    "type" "LinkType" NOT NULL DEFAULT 'User',

    CONSTRAINT "Link_Shortener_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Link_Shortener_Count" (
    "id" VARCHAR(50) NOT NULL,
    "click_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Link_Shortener_Count_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period_Year" (
    "periode_year_id" CHAR(36) NOT NULL,
    "period" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Period_Year_pkey" PRIMARY KEY ("periode_year_id")
);

-- CreateTable
CREATE TABLE "Organisasi" (
    "suborgan_id" CHAR(36) NOT NULL,
    "period_id" TEXT NOT NULL,
    "organisasi" "Organisasi_Type" NOT NULL,
    "is_suborgan" BOOLEAN NOT NULL,
    "organisasi_name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vision" TEXT,
    "mission" TEXT,
    "image" TEXT NOT NULL,
    "image_description" TEXT NOT NULL,
    "companion" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "structure" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organisasi_pkey" PRIMARY KEY ("suborgan_id")
);

-- CreateTable
CREATE TABLE "Twibbon" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "frame_url" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "color_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "caption" TEXT,
    "type" "TwibbonType" NOT NULL DEFAULT 'PHOTO',

    CONSTRAINT "Twibbon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "user_id" CHAR(36) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aspirasi" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_id" CHAR(36),
    "judul_aspirasi" TEXT NOT NULL,
    "pesan_aspirasi" TEXT NOT NULL,
    "organisasi" "Organisasi_Type",
    "unit_sekolah" "UnitSekolah",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aspirasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToTag" (
    "A" CHAR(36) NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Auth_userEmail_key" ON "User_Auth"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Link_Shortener_slug_key" ON "Link_Shortener"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Link_Shortener_Count_id_key" ON "Link_Shortener_Count"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Period_Year_period_key" ON "Period_Year"("period");

-- CreateIndex
CREATE UNIQUE INDEX "Organisasi_organisasi_period_id_key" ON "Organisasi"("organisasi", "period_id");

-- CreateIndex
CREATE UNIQUE INDEX "Twibbon_slug_key" ON "Twibbon"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");

-- AddForeignKey
ALTER TABLE "User_Auth" ADD CONSTRAINT "User_Auth_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("form_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field_Option" ADD CONSTRAINT "Field_Option_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("field_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("form_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission_Field" ADD CONSTRAINT "Submission_Field_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("submission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission_Field" ADD CONSTRAINT "Submission_Field_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "Field"("field_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link_Shortener" ADD CONSTRAINT "Link_Shortener_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link_Shortener_Count" ADD CONSTRAINT "Link_Shortener_Count_id_fkey" FOREIGN KEY ("id") REFERENCES "Link_Shortener"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organisasi" ADD CONSTRAINT "Organisasi_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "Period_Year"("periode_year_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Twibbon" ADD CONSTRAINT "Twibbon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aspirasi" ADD CONSTRAINT "Aspirasi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aspirasi" ADD CONSTRAINT "Aspirasi_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("tagName") ON DELETE CASCADE ON UPDATE CASCADE;
