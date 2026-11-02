/**
 * Helper to generate a short random id shared by all the requests of one admin action, so that the server's debug log
 * ("Debug options" in the settings) can group their lines. Only [a-z0-9], as the server expects.
 */
export default function newActionId() {
  return Math.random().toString(36).slice(2, 8).padEnd(6, "0");
}
