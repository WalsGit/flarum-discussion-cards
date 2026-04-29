import BaseItem from "./common/BaseItem";
import Dropdown from "flarum/common/components/Dropdown";
import DiscussionControls from "flarum/forum/utils/DiscussionControls";
import Link from "flarum/common/components/Link";
import DiscussionMedia from "./common/DiscussionMedia";
import DiscussionTitle from "./common/DiscussionTitle";
import DiscussionBadges from "./common/DiscussionBadges";
import DiscussionTags from "./common/DiscussionTags";
import DiscussionReplies from "./common/DiscussionReplies";
import DiscussionPreview from "./common/DiscussionPreview";


export default class CardItem extends BaseItem {
    view() {
        const discussion = this.discussion;
        const settings = this.settings;
        const jumpTo = this.getJumpTo();

        // Getting the tagId for [data-tag-id=] needed when we are in tag pages to use their custom Discussion Cards settings
        const isTagPage = m.route.get().split('?')[0].startsWith('/t/');
        const tagSlug = m.route.param().tags ?? null;
        const currentTagId = isTagPage ? app.store.all('tags').find(t => t.slug() === tagSlug).data.id : '';

        return (
            <div
                key={discussion.id()}
                data-id={discussion.id()}
                data-tag-id={currentTagId}
                className={this.getItemClasses("CardsListItem Card")}
            >
                {DiscussionControls.controls(discussion, this).toArray().length 
                    ? m(
                        Dropdown,
                        {
                            icon: "fas fa-ellipsis-v",
                            className: "DiscussionListItem-controls",
                            buttonClassName:
                            "Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right",
                        },
                        DiscussionControls.controls(discussion, this).toArray()
                        )
                    : ""}

                <Link href={app.route.discussion(discussion, jumpTo)} className="cardLink">
                    {/* Optional: Badges component */}
                    <DiscussionBadges discussion={discussion} settings={settings} />

                    {/* Media component (image + views + author & date) */}
                    <DiscussionMedia discussion={discussion} settings={settings} />

                    {/* Tags component */}
                    <DiscussionTags discussion={discussion} />

                    {/* Title component */}
                    <div className="cardTitle">
                        <DiscussionTitle discussion={discussion} settings={settings} />
                    </div>

                    {/* Optional: Preview text */}
                    <DiscussionPreview discussion={discussion} settings={settings} />

                    {/* Optional: Replies component*/}
                    <DiscussionReplies discussion={discussion} settings={settings} layout="card" />
                </Link>
            </div>
        );
    }
}
