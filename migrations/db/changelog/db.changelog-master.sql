-- liquibase formatted sql

-- changeset ADMIN:1731068665982-1
CREATE TABLE "encodings" ("uuid" UUID DEFAULT gen_random_uuid() NOT NULL, "date_created" TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL, "encoding" JSONB NOT NULL, "school_id" VARCHAR NOT NULL, "id_ai" INTEGER GENERATED BY DEFAULT AS IDENTITY (START WITH 54) NOT NULL, CONSTRAINT "encodings_pkey" PRIMARY KEY ("uuid"));

-- changeset ADMIN:1731068665982-2
CREATE TABLE "keys" ("uuid" VARCHAR(255) DEFAULT 'gen_random_uuid()' NOT NULL, "key" VARCHAR(255) NOT NULL, "role" VARCHAR(255), "active" BOOLEAN DEFAULT FALSE NOT NULL, CONSTRAINT "keys_pkey" PRIMARY KEY ("uuid"));

-- changeset ADMIN:1731068665982-3
CREATE TABLE "history" ("uuid" UUID DEFAULT gen_random_uuid() NOT NULL, "date_created" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL, "school_id" TEXT NOT NULL, "time_in" TIMESTAMP WITH TIME ZONE NOT NULL, "time_out" TIMESTAMP WITH TIME ZONE, CONSTRAINT "history_pkey" PRIMARY KEY ("uuid"));

-- changeset ADMIN:1731068665982-4
CREATE TABLE "users" ("uuid" UUID DEFAULT uuid_generate_v4() NOT NULL, "first_name" VARCHAR(50) NOT NULL, "middle_name" VARCHAR(50), "last_name" VARCHAR(50) NOT NULL, "school_id" VARCHAR(20) NOT NULL, "department" VARCHAR(100) NOT NULL, "program" VARCHAR(100) NOT NULL, CONSTRAINT "users_pkey" PRIMARY KEY ("uuid"));

-- changeset ADMIN:1731068665982-5
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" UNIQUE ("school_id");

-- changeset ADMIN:1731068665982-6
ALTER TABLE "encodings" ADD CONSTRAINT "fk_srcode" FOREIGN KEY ("school_id") REFERENCES "users" ("school_id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- changeset ADMIN:1731068665982-7
ALTER TABLE "history" ADD CONSTRAINT "history_sr_code_fkey" FOREIGN KEY ("school_id") REFERENCES "users" ("school_id") ON UPDATE NO ACTION ON DELETE NO ACTION;

-- changeset ADMIN:1731068665982-8
ALTER TABLE "encodings" ADD CONSTRAINT "school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "users" ("school_id") ON UPDATE NO ACTION ON DELETE NO ACTION;

