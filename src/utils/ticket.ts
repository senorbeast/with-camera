import type { ScanResult, TicketPayload } from "../types";
import { getTicketUsageMessage, hashTicketJson, incrementTicketScanCount } from "./ticketUsage";

function getTextField(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function getTicketObject(value: unknown): TicketPayload | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as TicketPayload) : null;
}

export async function parseTicketPayload(rawPayload: string): Promise<ScanResult> {
  try {
    const parsedJson = JSON.parse(rawPayload) as unknown;
    const parsed = getTicketObject(parsedJson);

    if (!parsed) {
      return {
        isValid: false,
        rawPayload,
        usageMessage: "Invalid Ticket",
      };
    }

    const source = getTextField(parsed.source);
    const destination = getTextField(parsed.destination);
    const ticketHash = await hashTicketJson(parsedJson);
    const scanCount = incrementTicketScanCount(ticketHash);
    const hasExplicitValidity = Object.prototype.hasOwnProperty.call(parsed, "validity");
    const isPayloadValid = parsed.validity === true || parsed.validity === "true";
    const canUseTicket = (!hasExplicitValidity || isPayloadValid) && scanCount < 3;

    return {
      isValid: canUseTicket,
      source,
      destination,
      rawPayload,
      ticketHash,
      scanCount,
      usageMessage: hasExplicitValidity && !isPayloadValid ? "Invalid Ticket" : getTicketUsageMessage(scanCount),
    };
  } catch {
    return {
      isValid: false,
      rawPayload,
      usageMessage: "Invalid Ticket",
    };
  }
}
