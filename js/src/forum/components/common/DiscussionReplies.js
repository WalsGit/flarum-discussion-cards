/*
 * Component that displays the number of replies on discussion cards (optional)
 */
import Component from "flarum/common/Component";
import Link from "flarum/common/components/Link";
import Icon from "flarum/common/components/Icon";
import craftRepliesAvatars from "../../utils/craftRepliesAvatars";
import abbreviateNumber from "flarum/common/utils/abbreviateNumber";
import DiscussionLastPost from "./DiscussionLastPost";

export default class DiscussionReplies extends Component {
  view(vnode) {
    const { discussion, settings, layout } = this.attrs;

    if (Number(settings.showReplies) !== 1) return null;

    const replyText = discussion.unreadCount()
      ? app.translator.trans("walsgit_discussion_cards.forum.unreadReplies", {
          count: discussion.unreadCount(),
        })
      : app.translator.trans("walsgit_discussion_cards.forum.replies", {
          count: discussion.replyCount() || "0",
        });

    const postCount = discussion.unreadCount()
      ? discussion.unreadCount()
      : discussion.replyCount();

    // For Primary Cards layout (shows avatars & number of unread replies or total replies) and list cards layout on mobile
    if (layout === "card" || layout === "mobile") {
      return (
        <div className="dc-card-spacer">
          <Link
            className="dc-replies"
            href={app.route.discussion(discussion, discussion.lastPostNumber())}
          >
            <div className="dc-replies-left">
              <div className="dc-replies-avatars">
                {craftRepliesAvatars(discussion)}
              </div>
              <div className="dc-reply-count">{replyText}</div>
            </div>
            <div className="dc-replies-right">
              {/* Optional: Last post (reply) info component */}
              <DiscussionLastPost
                discussion={discussion}
                settings={settings}
                layout="card"
              />
              <div className="dc-replies-arrow">
                <Icon name="fa-solid fa-angle-right" />
              </div>
            </div>
          </Link>
        </div>
      );
    }

    // For List cards layout (icon via css + number on the right)
    if (layout === "list") {
      return (
        <div className="DiscussionListItem-replyCount">
          <span aria-hidden="true">{abbreviateNumber(postCount)}</span>
          <span className="visually-hidden">
            {app.translator.trans(
              "core.forum.discussion_list.unread_replies_a11y_label",
              { count: postCount }
            )}
          </span>
        </div>
      );
    }

    // List cards responsive fallback when screen size is reduced to mobile or less (icon + number on the right)
    if (layout === "fallback") {
      return (
        <div className="dc-image-label dc-image-label--replies">
          <Icon name="fa-solid fa-comment" className="dc-label-icon" />
          {postCount}
        </div>
      );
    }

    return null;
  }
}
