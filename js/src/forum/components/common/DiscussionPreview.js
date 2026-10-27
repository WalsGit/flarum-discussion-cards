/*
 * Component that displays the preview text of the first post on discussion cards (optional)
 */
import Component from "flarum/common/Component";
import { truncate } from "flarum/common/utils/string";

export default class DiscussionPreview extends Component {
  view(vnode) {
    const { discussion, settings, maxLength = 150 } = this.attrs;

    if (Number(settings.previewText) !== 1) return null;

    // 3rd Party extension support (fof/blog): use the blog post's summary instead of the first post, if enabled.
    // blogMeta only exists when the extension is enabled and when the API includes it.
    if (
      Number(settings.useBlogSummary) === 1 &&
      typeof discussion.blogMeta === "function"
    ) {
      const summary = discussion.blogMeta()?.summary?.();
      if (summary) {
        return (
          <div className="dc-preview-post">{truncate(summary, maxLength)}</div>
        );
      }
    }

    if (
      !discussion.firstPost ||
      typeof discussion.firstPost !== "function" ||
      !discussion.firstPost()
    )
      return null;

    return (
      <div className="dc-preview-post">
        {truncate(discussion.firstPost().contentPlain(), maxLength)}
      </div>
    );
  }
}
