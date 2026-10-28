/*
 * Component that displays the discussion title on discussion cards
 */
import Component from "flarum/common/Component";
import { truncate } from "flarum/common/utils/string";

export default class DiscussionTitle extends Component {
  view(vnode) {
    const { discussion, settings } = this.attrs;

    // Optional: support for 3rg party extension Repost
    const repostActivated = "shebaoting-repost" in flarum.extensions;
    const originalUrl = repostActivated
      ? discussion.attribute("originalUrl")
      : null;
    // Only http(s) urls are used as link target
    const repostUrl =
      typeof originalUrl === "string" && /^https?:\/\//i.test(originalUrl)
        ? originalUrl
        : null;

    // Title max length (default: 80)
    const maxLength = 80;

    return (
      <h2 title={discussion.title()} className="dc-card-heading">
        {Number(settings.allowRepostLinks) === 1 && repostUrl ? (
          <a
            href={repostUrl}
            target="_blank"
            rel="noopener noreferrer"
            onclick={(e) => e.stopPropagation()}
          >
            {truncate(discussion.title(), maxLength)}
          </a>
        ) : (
          truncate(discussion.title(), maxLength)
        )}
      </h2>
    );
  }
}
