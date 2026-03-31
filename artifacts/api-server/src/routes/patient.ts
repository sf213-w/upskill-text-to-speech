import { Router, type IRouter } from "express";
import { db, patientHealthProfileTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/health-profile", async (req, res) => {
  try {
    const {
      userId,
      languagePreference,
      firstName,
      lastName,
      dateOfBirth,
      biologicalSex,
      knownConditions,
      allergies,
      surgicalHistory,
      medications,
      visitReason,
      symptomSeverity,
      symptomDuration,
      consentGiven,
      privacySetting,
    } = req.body;

    if (!languagePreference || !firstName || !lastName || !dateOfBirth || !biologicalSex) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "Missing required fields" });
      return;
    }

    const [profile] = await db
      .insert(patientHealthProfileTable)
      .values({
        userId: userId ?? null,
        languagePreference,
        firstName,
        lastName,
        dateOfBirth,
        biologicalSex,
        knownConditions: knownConditions ?? [],
        allergies: allergies ?? null,
        surgicalHistory,
        medications: medications ?? [],
        visitReason,
        symptomSeverity,
        symptomDuration,
        consentGiven,
        privacySetting,
      })
      .returning();

    res.status(201).json(profile);
  } catch (err) {
    req.log.error({ err }, "Failed to create patient health profile");
    res.status(500).json({ error: "SERVER_ERROR", message: "Failed to save health profile. Please try again." });
  }
});

export default router;
