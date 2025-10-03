/*
* Component that displays the preview text of the first post on discussion cards (optional)
*/
import Component from "flarum/common/Component";
import { truncate } from "flarum/common/utils/string";

export default class DiscussionPreview extends Component {
    view(vnode) {
        const { discussion, settings, maxLength = 150 } = this.attrs;

        if (Number(settings.previewText) !== 1) return null;
        if (!discussion.firstPost()) return null;

        return (
            <div className="previewPost">
                {truncate(discussion.firstPost().contentPlain(), maxLength)}
            </div>
        );
    }
}
