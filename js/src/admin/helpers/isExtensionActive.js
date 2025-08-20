export default function isExtensionActive(extensionName) {
    if (app.data.settings.extensions_enabled.includes(extensionName)) {
        return true;
    }
    return false;
}