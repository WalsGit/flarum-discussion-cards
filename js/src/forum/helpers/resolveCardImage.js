/**
 * Gets the card image url
 */
export default function resolveCardImage(discussion) {
  return discussion.attribute('cardImageUrl') || null;
}
