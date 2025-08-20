export default function isExtensionInstalled(extensionName) {
    if (app.data.extensions.hasOwnProperty(extensionName)) {
        return true;
    }
    return false;
}