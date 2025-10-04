import CardItem from './components/CardItem';
import ListItem from './components/ListItem';

import DiscussionMedia from './components/common/DiscussionMedia';
import DiscussionPreview from './components/common/DiscussionPreview';
import DiscussionReplies from './components/common/DiscussionReplies';
import DiscussionBadges from './components/common/DiscussionBadges';
import DiscussionLastPost from './components/common/DiscussionLastPost';

import craftTags from './utils/craftTags';
import craftBadges from './utils/craftBadges';

export default {
  // Main components
  'walsgit/discussion/cards/components/CardItem': CardItem,
  'walsgit/discussion/cards/components/ListItem': ListItem,

  // Reusable subcomponents
  'walsgit/discussion/cards/components/common/DiscussionMedia': DiscussionMedia,
  'walsgit/discussion/cards/components/common/DiscussionPreview': DiscussionPreview,
  'walsgit/discussion/cards/components/common/DiscussionReplies': DiscussionReplies,
  'walsgit/discussion/cards/components/common/DiscussionBadges': DiscussionBadges,
  'walsgit/discussion/cards/components/common/DiscussionLastPost': DiscussionLastPost,

  // Utilities
  'walsgit/discussion/cards/utils/craftTags': craftTags,
  'walsgit/discussion/cards/utils/craftBadges': craftBadges,
};
