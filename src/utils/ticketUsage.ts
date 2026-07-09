const STORAGE_KEY_PREFIX = "qr-ticket-scan-count:";

const memoryCounts = new Map<string, number>();

type JsonRecord = Record<string, unknown>;

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJson);
  }

  if (value && typeof value === "object") {
    return Object.keys(value as JsonRecord)
      .sort()
      .reduce<JsonRecord>((sorted, key) => {
        sorted[key] = sortJson((value as JsonRecord)[key]);
        return sorted;
      }, {});
  }

  return value;
}

function toHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function fallbackHash(value: string) {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readStoredCount(ticketHash: string) {
  const storageKey = `${STORAGE_KEY_PREFIX}${ticketHash}`;
  const storedCount = memoryCounts.get(ticketHash);
  const storage = getStorage();

  if (!storage) {
    return storedCount ?? 0;
  }

  let rawValue: string | null = null;

  try {
    rawValue = storage.getItem(storageKey);
  } catch {
    return storedCount ?? 0;
  }

  const parsedCount = rawValue ? Number.parseInt(rawValue, 10) : 0;
  return Number.isFinite(parsedCount) ? parsedCount : storedCount ?? 0;
}

function writeStoredCount(ticketHash: string, count: number) {
  memoryCounts.set(ticketHash, count);

  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(`${STORAGE_KEY_PREFIX}${ticketHash}`, String(count));
  } catch {
    // The in-memory count above still keeps the current session consistent.
  }
}

export async function hashTicketJson(ticketJson: unknown) {
  const canonicalJson = JSON.stringify(sortJson(ticketJson));
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.subtle) {
    return fallbackHash(canonicalJson);
  }

  try {
    const bytes = new TextEncoder().encode(canonicalJson);
    const digest = await cryptoApi.subtle.digest("SHA-256", bytes);
    return toHex(digest);
  } catch {
    return fallbackHash(canonicalJson);
  }
}

export function incrementTicketScanCount(ticketHash: string) {
  const nextCount = readStoredCount(ticketHash) + 1;
  writeStoredCount(ticketHash, nextCount);
  return nextCount;
}

export function getTicketUsageMessage(scanCount: number) {
  if (scanCount === 1) {
    return "Thank You! You can Enter";
  }

  if (scanCount === 2) {
    return "Thank You! You can Exit";
  }

  return "Invalid QR Code Ticket";
}
