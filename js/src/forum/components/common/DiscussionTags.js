/*
* Component that displays Tags on discussion cards (optional)
*/
import Component from "flarum/common/Component";
import craftTags from "../../utils/craftTags";

export default class DiscussionTags extends Component {
    view(vnode) {
        const { discussion } = this.attrs;

        return (
            <div className="cardTags">
                {craftTags(discussion.tags())}
            </div>
        );
    }
}
