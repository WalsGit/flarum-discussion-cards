export default function isExtensionActive(extensionName) {
  let enabled;

  try {
    enabled = JSON.parse(app.data.settings.extensions_enabled);
  } catch (e) {
    return false;
  }

  return Array.isArray(enabled) && enabled.includes(extensionName);
}
