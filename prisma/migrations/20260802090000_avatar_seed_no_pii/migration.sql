-- Avatar URLs are third-party (dicebear) and are now readable on the public
-- portfolio endpoint, so an email-seeded URL leaked the address to any viewer
-- and to dicebear itself. Re-seed every existing avatar with a truncated
-- SHA-256 of the lowercased email, matching src/server/avatar.ts.
UPDATE "User"
SET "avatarUrl" =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=' ||
  substring(encode(sha256(convert_to(lower(btrim(email)), 'UTF8')), 'hex') from 1 for 16)
WHERE "avatarUrl" LIKE '%avataaars%'
  AND ("avatarUrl" LIKE '%@%' OR "avatarUrl" LIKE '%\%40%');
