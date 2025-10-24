/*
* Component that displays the card image of the discussion cards
*/
import Component from "flarum/common/Component";
import humanTime from "flarum/common/utils/humanTime";
import username from "flarum/common/helpers/username";
import icon from "flarum/common/helpers/icon";

export default class DiscussionMedia extends Component {
    view(vnode) {
        const { discussion, settings } = this.attrs;
        const imageUrl = discussion.attribute("cardImageUrl") || null;

        // optional data to show on top of image
        const attrs = {
            className: "wrapImg" + (Number(settings.showAuthor) === 1 ? " After" : ""),
        };

        // 3rd party "views" extensions support
        const viewsActivated = "flarumite-simple-discussion-views" in flarum.extensions;
        const isViewsSet = discussion.data.attributes.hasOwnProperty("views");

        const mbViewsActivated = "michaelbelgium-discussion-views" in flarum.extensions;
        const isViewCountSet = discussion.data.attributes.hasOwnProperty("viewCount");

        const viewsCount =
            viewsActivated && isViewsSet
            ? discussion.views()
            : mbViewsActivated && isViewCountSet
            ? discussion.viewCount()
            : NaN;

    return (
        <div {...attrs}>
            {/* Optional: show Views */}
            {(isViewsSet || isViewCountSet) &&
                Number(settings.showViews) === 1 &&
                !isNaN(viewsCount) && (
                    <div className="imageLabel discussionViews">
                        {icon("fas fa-eye", { className: "labelIcon" })}
                        {viewsCount}
                    </div>
            )}

            {/* Image */}
            {imageUrl ? (
                <img
                    src={imageUrl}
                    className="previewCardImg"
                    alt={discussion.title()}
                    loading="lazy"
                />
            ) : (
                // fallback to Discussion Cards' extension default image
                <div className="imgStub" />
            )}

            {/* Optional: show author & date */}
            {Number(settings.showAuthor) === 1 && (
                <div className="cardFoot">
                    <div className="Author">{username(discussion.user())}</div>
                    <div className="Date">{humanTime(discussion.createdAt())}</div>
                </div>
            )}
        </div>
        );
    }
}
