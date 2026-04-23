import UploadImageButton from 'flarum/common/components/UploadImageButton';
import app from 'flarum/admin/app';

export default class TagUploadImageButton extends UploadImageButton {
  /**
   * After a successful upload/removal, update the tag in the store instead of reloading the page.
   */
  success(response) {
    // Update the tag in the store with the new image data
    if (response && response.data && response.data.attributes) {
      const tagId = response.data.id;
      const tag = app.store.getById('tags', tagId);

      if (tag) {
        // Update the tag's attributes with the new image data
        tag.pushAttributes({
          walsgitDiscussionCardsTagDefaultImage: response.data.attributes.walsgitDiscussionCardsTagDefaultImage
        });
      }
    }

    // Stop loading indicator
    this.loading = false;
    m.redraw();
  }
}