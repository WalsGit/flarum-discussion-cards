/*
* Component that displays the last post info on discussion cards (optional)
* Uses the TerminalPost component from Flarum
*/
import Component from "flarum/common/Component";
import TerminalPost from "flarum/components/TerminalPost";

export default class DiscussionLastPost extends Component {
    view(vnode) {
        const { discussion, settings, layout } = this.attrs;

        if (Number(settings.showLastPostInfo) !== 1) return null;
        if (!discussion.firstPost()) return null;

        if (layout === "card") {
            return (
                <div className="terminalPost">
                    <TerminalPost
                        discussion={discussion}
                        lastPost={discussion.lastPostNumber()}
                    />
                </div>
            );
        }

        if (layout === "list") {
            return (
                <div className="terminalPost">
                    <TerminalPost
                        discussion={discussion}
                        lastPost={discussion.lastPostNumber()}
                    />
                </div>
            );
        }

        return null;
    }
}
