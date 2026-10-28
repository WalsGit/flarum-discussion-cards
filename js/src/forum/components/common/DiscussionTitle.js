/*
 * Component that displays the discussion title on discussion cards
 */
import Component from "flarum/common/Component";
import Icon from "flarum/common/components/Icon";
import { truncate } from "flarum/common/utils/string";

export default class DiscussionTitle extends Component {
  view(vnode) {
    const { discussion, settings } = this.attrs;

    // Optional: support for 3rd party extension Repost
    const repostActivated = "shebaoting-repost" in flarum.extensions;
    const originalUrl = repostActivated
      ? discussion.attribute("originalUrl")
      : null;
    // Only http(s) urls are used as link target
    const repostUrl =
      typeof originalUrl === "string" && /^https?:\/\//i.test(originalUrl)
        ? originalUrl
        : null;

    // Optional support for 3rd party extension Repost:
    // source domain shown (without www) after the title, when enabled
    let repostDomain = null;
    if (repostUrl && Number(settings.showRepostDomain) === 1) {
      try {
        repostDomain = new URL(repostUrl).hostname.replace(/^www\./i, "");
      } catch (e) {
        // Ignore malformed data
      }
    }

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
            {Number(settings.showRepostIcon) === 1 && (
              <Icon name="fas fa-square-up-right" className="dc-repost-icon" />
            )}
            {truncate(discussion.title(), maxLength)}
            {repostDomain && (
              <span className="dc-repost-domain">{repostDomain}</span>
            )}
          </a>
        ) : (
          truncate(discussion.title(), maxLength)
        )}
      </h2>
    );
  }
}
