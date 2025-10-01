/**
 * Gets the card image url
 */
export default async function resolveCardImage(discussion) {
    return discussion.attribute('cardImageUrl') || null;
}
