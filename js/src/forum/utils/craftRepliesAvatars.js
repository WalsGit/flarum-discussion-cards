/**
 * Crafts avatars of some participants of the discussion (used in primary cards)
 * @param {Discussion} discussion
 * @returns {Mithril.Children}
 */

import avatar from "flarum/common/helpers/avatar";

export default function craftRepliesAvatars(discussion) {
    const participants = [];

    // Always add the discussion starter
    const starter = discussion.user && discussion.user();
    if (!starter) {
        return null;
    }
    participants.push(starter);

    // Then add the last poster if they're different from the starter
    const lastPoster = discussion.lastPostedUser && discussion.lastPostedUser();
    if (lastPoster && lastPoster.id() !== starter.id()) {
        participants.push(lastPoster);
    }

    // Limit to 2 participants maximum (starter + last poster)
    const finalParticipants = participants.slice(0, 2);

    return finalParticipants.map((user) => (
        <>{avatar(user, {className: 'Avatar--mini'})}</>
    ));
}
