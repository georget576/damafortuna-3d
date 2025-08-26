-- Create the userNotes column in JournalEntry table
ALTER TABLE "JournalEntry" ADD COLUMN "userNotes" TEXT;

-- Add a comment for the new column
COMMENT ON COLUMN "JournalEntry"."userNotes" IS 'User personal notes and reflections about the reading';