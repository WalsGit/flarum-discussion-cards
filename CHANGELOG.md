# Changelog

## [1.4.3] - 2026-04-29
### Added
- Backend: a listener has been added to resolve a new card image for the discussion on first post deletion

### Changed
- Admin Settings Page: some labels & help texts
- Admin Settings Page: 3rd party extensions' URLs
- Backend: removed unnecessary helper
- Updated README.md & CHANGELOG.md

### Fixed
- Primary Cards: on tag pages, custom width of cards set in tag settings weren't taken into account.
- Primary Cards: avatars' alignment on primary cards
- List Cards: reply count was always showing total replies instead of unread total when needed.
- Console: Regenerate-images command wasn't working properly when the --without (or -w) option was used.
- Console: when (re)generating card image on discussions where the first post was deleted (first_post_id = null in DB) an error was thrown instead of reverting to one of the defaults

## [1.4.2] - 2026-04-13
### Added
- Logging service to allow creation of logs in `Storage/logs/walsgit-discussion-cards/`.
- The command `php flarum discussion-cards:migrate-images` will now generate more detailed logs in migration-YYYY-mm-dd.log files when executed.
### Changed
- Better checks & validation for the command `php flarum discussion-cards:migrate-images` (do folders exists and have the right permissions, and cleanup shouldn't run if there's any file migration or DB error)
### Fixed
- Some typos.

## [1.4.1] - 2026-04-08
### Fixed
- DB index creation wouldn't work on Flarum DBs with table prefixes.

## [1.4.0] - 2026-04-07
### Added
- Gif & bmp are now accepted image file extensions to upload (as default card images).
- Tag icons are now shown with their tag name on cards
- NEW OPTION to deactivate (totally or partially) cards for discussion list items (non primary cards) and show the original Flarum discussion list instead for the remaining discussions. Can be set globally or per tag and limited to a # of discussions.
- NEW FEATURE: CLI command to migrate old default card images to new structure `discussion-cards:migrate-images`. Changed composer.json to auto run it on extension update.
- NEW FEATURE: CLI commands to purge and regenerate images `discussion-cards:purge-images` & `discussion-cards:regenerate-images`
- NEW FEATURE: a toolbar to the Admin Settings Page with stats on images and a tools menu to refresh stats, purge and regenerate images (limited).
- a Documentation link to the extension's Wiki in the Admin Settings Page.
- When a discussion is deleted, so is its discussion card image from the server.
- New components added to compat.js
- DB indexes on new `walsgit_card_image_url` column

### Changed
- Requires Flarum minimum version of 1.8.0.
- How and where images are stored (now in `/assets/extensions/walsgit-discussion-cards/`).
- Better validation for uploaded images.
- New default images filenames.
- All Images are now converted to webp format.
- Card images are no longer resolved in the frontend but server side (some trade-offs). They are resolved and created when a discussion is created or modified.
- Supported embeds in new server side image detection : YouTube & Dailymotion thumbnails, Imgur (partial - single image embeds only) & Postimage embeds.
- Card images are now downloaded and converted to a small webp version and saved on the server with a filename like `discussion-{id}-*.webp` in the folder `/assets/extensions/walsgit-discussion-cards/`.
- For the 3rd party Blog Extension support: default blog image will now be converted and saved as `blog-default-card-image.webp`
- 3rd party views extension support change: abandoned `flarumite/simple-discussion-views` replaced by `fof/discussion-views`.
- Avatars on cards now only show the first post user and, if different, the last post user, as those data points are already included in flarum's payload (for better performance).
- Last poster info on cards is now anchored at the bottom of the cards (instead of after the preview text).
- An asterisk `*` is no longer shown next to the number of unread replies.
- Some Text descriptions in Admin Settings Page.
- A lot of code refactoring.

### Fixed
- No more loading unnecessary posts data to payload
- Tag Settings Modal: uploading or removing a Tag default card image doesn't need to reload the page anymore to see the changes.
- Title will remain on one line on list cards (tablet & desktop screens only) and overflowing long titles will now be truncated and scroll on hover to read the full text.
- Some typos & style issues.

## [1.3.0] - 2025-05-29
### Added
- Added support for the `michaelbelgium/flarum-discussion-views` extension. To display views count on cards you can now use either michaelbelgium's or flarumite's extension.

### Changed
- Cards now link to the discussion's first unread post (reply) or to the last post if all are read.
- Number of replies on cards now shows the number of unread replies (with an **asterisk**) when there are unread replies, and the total number of replies otherwise (discussion fully read).
- English & French translations updated for the show views settings and unread replies count display on cards.

### Fixed
- cards didn't display when at least one discussion had a FOF Best Answer badge and show badges was activated. (partial fix as the Best Answer badge is displayed without icon or color because that data isn't passed to the payload by the FOF Best Answer extension) so still WIP but not a breaking bug anymore.

## [1.2.0] - 2024-12-17
### Added
- NEW option to show the number of replies on the right side of a card's title (like the default Flarum design) instead of on the image.
- NEW option to show the last post informations on the cards (like the default Flarum design): username & date of last post.
- NEW FEATURE: support for `shebaoting/repost` extension.
- New migration file for the aforementioned new options & features.
- Post image search function now detects images in posts set via inline styles property `background: url(...)` or `background-image: url()`, like for the thumbnails in YouTube video embeds.

### Changed
- The way read cards are marked (removed B&W filter): now read cards' title and text have a lighter font weight (like the default Flarum discussion list behavior)
- When there are too many tags, not all of them where visible: now they will scroll horizontally when you hover on the cards' tag list on desktop and you can manually scroll them on mobile.

## [1.1.1] - 2024-11-25
### Fixed
- French translation bug

## [1.1.0] - 2024-11-22
### Added
- NEW FEATURE: Support for `v17development/flarum-blog` extension
- NEW Option to chose to use the blog's images (post featured image and blog default's image) for blog post cards
- NEW Option to chose to use blog posts' summary as preview text for blog post cards
- A donation link

### Changed
- Options for 3rd party extensions will only be enabled if said extensions are installed and activated.
- Text & description associated with 3rd party extensions options

### Fixed
- Views won't throw error when `show views` option is activated but the relevant extension isn't installed and activated.

## [1.0.4] - 2024-11-16
### Added
- Support & discuss URLs

## [1.0.3] - 2024-11-15
### Changed
- Removed old funding.yml

## [1.0.2] - 2024-11-15
### Changed
- Renaming the extension to Flarum Discussion Cards

## [1.0.1] - 2024-11-15
### Fixed
- French translation bug (removed extra quote)

## [1.0.0] - 2024-11-15
### Added
- NEW FEATURE : Setting a default image per tag
- NEW FEATURE : Setting custom number of primary cards and custom cards width per tag
- NEW on Index page (all discussions) shows default card images based on tags of discussion (based on tag priority)
- NEW migrations (tag settings)
- Client and server-side validation for the tags settings
- Some validation for the general extension settings
- French translation
- Changelog.md

### Changed
- Admin Settings page form & text
- Image stub (changed it for a more neutral one with the Flarum logo)
- Migrations (with new settings keys and added new tag settings)
- Switched read/unread discussions' filter (now read are grayscaled and unread are in full colors)
- Readme.md, License.md, namespace...
- Removed Russian translation

### Fixed
- Replaced deprecated $.tooltip
- UploadImageButton now showing the uploaded image (created a new custom component).
