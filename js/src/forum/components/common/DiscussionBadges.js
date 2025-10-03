/*
* Component that displays badges on discussion cards (optional)
*/
import Component from "flarum/common/Component";
import craftBadges from "../../utils/craftBadges";

export default class DiscussionBadges extends Component {
    view(vnode) {
        const { discussion, settings } = this.attrs;

        if (Number(settings.showBadges) !== 1) return null;

        return (
            craftBadges(discussion.badges().toArray())
        );
    }
}
