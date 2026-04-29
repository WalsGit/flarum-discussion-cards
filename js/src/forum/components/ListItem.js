import BaseItem from './common/BaseItem';
import Dropdown from 'flarum/common/components/Dropdown';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import Link from 'flarum/common/components/Link';
import DiscussionMedia from './common/DiscussionMedia';
import DiscussionTitle from './common/DiscussionTitle';
import DiscussionBadges from './common/DiscussionBadges';
import DiscussionTags from './common/DiscussionTags';
import DiscussionReplies from './common/DiscussionReplies';
import DiscussionLastPost from './common/DiscussionLastPost';
import DiscussionPreview from './common/DiscussionPreview';

export default class ListItem extends BaseItem {
  view() {
    const discussion = this.discussion;
    const settings = this.settings;
    const jumpTo = this.getJumpTo();

    return (
      <div key={discussion.id()} data-id={discussion.id()} className={this.getItemClasses('CardsListItem List')}>
        {DiscussionControls.controls(discussion, this).toArray().length
          ? m(
              Dropdown,
              {
                icon: 'fas fa-ellipsis-v',
                className: 'DiscussionListItem-controls',
                buttonClassName: 'Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right',
              },
              DiscussionControls.controls(discussion, this).toArray()
            )
          : ''}

        <Link href={app.route.discussion(discussion, jumpTo)} className="cardLink">
          {/* Optional: Badges component */}
          <DiscussionBadges discussion={discussion} settings={settings} />

          <div className="cardGrid">
            <div className="rowSpan-3 colSpan">
              {/* Media component (image + views + author & date) */}
              <DiscussionMedia discussion={discussion} settings={settings} />
            </div>

            <div className="rowSpan-3 colSpan-2">
              <div className="flexBox">
                <div className="cardTitle">
                  {/* Title component */}
                  <DiscussionTitle discussion={discussion} settings={settings} />
                  {/* Optional: Show number of Replies on the right (except on mobile screens) */}
                  {app.screen() !== 'phone' && Number(settings.showRepliesOnRight) === 1 && (
                    <DiscussionReplies discussion={discussion} settings={settings} layout="list" />
                  )}
                </div>
                {/* Tags component */}
                <DiscussionTags discussion={discussion} />
              </div>

              {/* Optional: Preview text */}
              <DiscussionPreview discussion={discussion} settings={settings} />

              {/* Optional: Last post (reply) info component */}
              {app.screen() !== 'phone' ? <DiscussionLastPost discussion={discussion} settings={settings} layout="list" /> : ''}

              {/* Optional: When on Mobile screen, use the mobile layout of the Replies components or show number & icon on the right  */}
              {app.screen() === 'phone' ? (
                <DiscussionReplies discussion={discussion} settings={settings} layout="mobile" />
              ) : (
                !Number(settings.showRepliesOnRight) && <DiscussionReplies discussion={discussion} settings={settings} layout="fallback" />
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }
}
