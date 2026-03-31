import { pgTable, uuid, text, date, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const patientHealthProfileTable = pgTable("patient_health_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  languagePreference: text("language_preference").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  biologicalSex: text("biological_sex").notNull(),
  knownConditions: text("known_conditions").array().notNull().default([]),
  allergies: text("allergies"),
  surgicalHistory: text("surgical_history").notNull(),
  medications: jsonb("medications").notNull().default([]),
  visitReason: text("visit_reason").notNull(),
  symptomSeverity: text("symptom_severity").notNull(),
  symptomDuration: text("symptom_duration").notNull(),
  consentGiven: boolean("consent_given").notNull().default(false),
  privacySetting: text("privacy_setting").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPatientHealthProfileSchema = createInsertSchema(patientHealthProfileTable).omit({ id: true, createdAt: true });
export type InsertPatientHealthProfile = z.infer<typeof insertPatientHealthProfileSchema>;
export type PatientHealthProfile = typeof patientHealthProfileTable.$inferSelect;
