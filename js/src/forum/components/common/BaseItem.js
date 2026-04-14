/*
 * Base component for CardItem.js & ListItem.js
 */
import Component from 'flarum/common/Component';
import { getDiscussionSettings } from '../../helpers/getDiscussionSettings';

export default class BaseItem extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.discussion = this.attrs.discussion;
    this.settings = getDiscussionSettings();
  }

  /* Sets which post to jump to when clicking on a card: first unread or last post. */
  getJumpTo() {
    const d = this.discussion;
    return Math.min(d.lastPostNumber() ?? 0, (d.lastReadPostNumber() || 0) + 1);
  }

  /* Optional: sets to show if card should be marked as read or unread. */
  isRead() {
    return Number(this.settings.markReadCards) === 1 && this.discussion.isRead() && app.session.user;
  }

  /* construct card classes. */
  getItemClasses(base = '') {
    return [base, this.isRead() ? 'read' : '', this.discussion.isHidden() ? 'Hidden' : ''].filter(Boolean).join(' ');
  }
}
