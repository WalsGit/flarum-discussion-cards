/**
 * Gets the Discussion Cards' settings
 */
export function getDiscussionSettings() {
    const settings = {};

    for (const key in app.forum.data.attributes) {
        if (key.startsWith("walsgitDiscussionCards")) {
        let newKey = key.replace("walsgitDiscussionCards", "");
        newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
        settings[newKey] = app.forum.data.attributes[key];
        }
    }

    return settings;
}
