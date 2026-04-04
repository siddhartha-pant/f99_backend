interface BlacklistedToken {
  expiresAt: number; // Unix timestamp in ms
}

const blacklist = new Map<string, BlacklistedToken>();

// Clean up expired tokens every 15 minutes so memory doesn't grow forever
setInterval(
  () => {
    const now = Date.now();
    for (const [token, { expiresAt }] of blacklist.entries()) {
      if (expiresAt < now) blacklist.delete(token);
    }
  },
  15 * 60 * 1000,
);

export function blacklistToken(token: string, expiresAt: number): void {
  blacklist.set(token, { expiresAt });
}

export function isTokenBlacklisted(token: string): boolean {
  const entry = blacklist.get(token);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) {
    blacklist.delete(token);
    return false;
  }
  return true;
}
