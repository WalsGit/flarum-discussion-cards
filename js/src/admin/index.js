import app from 'flarum/admin/app';
import Model from 'flarum/common/Model';
import Tag from 'ext:flarum/tags/common/models/Tag';
import extendEditTagModal from './extenders/extendEditTagModal';

export { default as extend } from './extend';

app.initializers.add('walsgit/discussion-cards', () => {
  Tag.prototype.WdcDefaultImage = Model.attribute('walsgit_discussion_cards_tag_default_image');

  extendEditTagModal();
});
