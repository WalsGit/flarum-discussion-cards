import Avatar from 'flarum/common/components/Avatar';

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
    <>
      <Avatar user={user} className="Avatar--mini" />
    </>
  ));
}
