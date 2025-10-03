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
        const repostUrl = discussion.data.attributes.original_url || null;

        // Title max length (default: 80)
        const maxLength = 80;

    return (
        <h2 title={discussion.title()} className="title">
            {Number(settings.allowRepostLinks) === 1 && repostActivated && repostUrl ? (
                <a href={repostUrl} onclick={(e) => e.stopPropagation()}>
                    {truncate(discussion.title(), maxLength)}
                </a>
            ) : (
                truncate(discussion.title(), maxLength)
            )}
        </h2>
        );
    }
}
