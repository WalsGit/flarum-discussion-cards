/**
 * Crafts avatars of some participants of the discussion (used in primary cards)
 * @param {Discussion} discussion
 * @returns {Mithril.Children}
 */

import avatar from "flarum/common/helpers/avatar";

export default function craftRepliesAvatars(discussion) {
    // Get the last 10 posts/replies should suffice to find 3 different users
    const posts = discussion.posts().splice(-10);
    if (!posts || posts.length === 0) return null;

    // Get the last 3 users to post in the discussion
    const lastAuthors = posts
        .map((p) => p.user && p.user())
        .filter(Boolean)
        .reverse()
        .filter((user, index, arr) => arr.findIndex((u) => u.id() === user.id()) === index)
        .slice(0, 3);

    return lastAuthors.map((user) => (
        <>{avatar(user, {className: 'Avatar--mini'})}</>
    ));
}
