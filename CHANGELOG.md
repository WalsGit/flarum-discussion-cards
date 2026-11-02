# Changelog

## [Unreleased]
### Security
- Backend: remote card images are now also validated for IPv6 NAT64 addresses (the embedded IPv4 address must be public), and redirects are re-validated.
- Backend: the shortcut that reuses `default-card-image.webp` is now limited to the extension's own local files and can no longer be triggered by arbitrary image URLs.
- Backend: the tag settings and allowed tags endpoints now check for admin rights first, then validate the submitted JSON and only accept known keys.
- Backend: the allowed tags setting is validated and normalized when saved.

### Added
- Forum/Admin: support for `michaelbelgium/flarum-discussion-views` (views count on cards).
- Forum/Admin: support for `shebaoting/flarum-repost` (formerly `shebaoting/repost`): the title of a card opens the discussion's source url in a new tab.
- Forum/Admin: two new options added to the `shebaoting/flarum-repost` support to show a link icon before the title and/or the source URL's domain after it.
- Forum/Admin: support for `fof/blog`, the Flarum 2 successor of the abandoned `v17development/flarum-blog` (blog images and blog post summary as preview text on cards).
- Backend: the card copy of the blog's default image is refreshed when the image is uploaded in `fof/blog` and deleted when it is removed. Note that card images are not regenerated automatically: images regeneration is needed after a deletion without replacement.
- Admin: new "Repair broken images" tool (Tools menu) and a "Broken images" counter in the stats banner. It detects the discussions whose card image file is missing from the server, regenerates their images, and can set the ones still broken back to empty as a last resort. Missing default images (general, tag, blog) are also reported but need to be fixed manually.
- Console: `discussion-cards:repair-images` command with `--dry-run` and `--reset-null` options, the CLI equivalent of the "Repair broken images" tool.
- Console: added a new `--log` option on `discussion-cards:regenerate-images`, `discussion-cards:repair-images` and `discussion-cards:purge-images` that writes the command that was run and the detail of each discussion or file processed to a log file in `storage/logs/walsgit-discussion-cards/`.
- Console: the same details are shown line by line in the terminal with the `-v` flag (instead of the progress bar), with the progress as a counter at the end of each line.
- Admin: new "Debug options" section at the end of the settings page with "Log actions" (who ran which tool and a summary of the result, in `admin-tools-actions-<date>.log`) and "Log action details" (with each discussion or file processed in a dedicated file). They only apply to actions run from the admin page's tools menu, not to Console commands.
- Backend: debug logs (`admin-tools-actions`, `regenerate`, `repair` and `purge`) older than 7 days are deleted whenever a log is written; no cron needed. Migration logs are never deleted.
- Forum: admins get a "Regenerate card image" item in the menu of the cards (primary and list cards, not in the standard Flarum list) to regenerate the image of a single discussion. Using a new admin-only endpoint `POST /api/walsgit/discussion-cards/regenerate-image/{id}`.

### Changed
- Backend: card images are now stored as a path relative to the extension's assets folder instead of an absolute URL, so a change of domain, scheme or sub-folder no longer breaks them. A migration converts the existing ones (external image URLs saved before 2.1.0 are left as they are). The `cardImageUrl` API attribute still returns an absolute URL, rebuilt from the forum's current URL. Breaking Change: **Extensions or themes that read the `discussions.walsgit_card_image_url` column directly now get a relative path.**
- Backend: card images are generated with short network timeouts (2s to connect, 4s in total) when a user is waiting for a post to be created or edited; console and admin tools keep longer ones.
- Admin: the "Purge images" and "Regenerate images" admin tools now call the extension's services directly instead of running `php flarum` commands in a subprocess. The regenerate tool works with a per-request time limit and the purge modal displays a summary of what was done.
- Backend: the post and discussion listeners now share a single image regeneration service, and the resolved image is always saved.
- Backend: the previous card image of a discussion is now deleted only after the new one has been created.
- Backend: PHP's `memory_limit` is only raised (to 256M) during image processing when it is lower, and never lowered.
- Backend: the extension's logs now use the forum's configured storage path.
- Backend: removed the Composer `post-install-cmd` / `post-update-cmd` scripts, which never run when the extension is installed as a dependency. After updating from `1.3.0` or earlier, run `php flarum discussion-cards:migrate-images` manually (see README).
- Admin: removed the "extensions missing Flarum V2 compatibility" warning of the settings page: all supported 3rd party extensions are now ported.
- Admin: the discussion check in the debug modal tells whether the discussion is a blog article, a regular discussion with a blog tag, or neither.
- Console: `--popular [-p]` and `--unpopular [-u]` now read `discussions.view_count` with `michaelbelgium/flarum-discussion-views` as well.
- Forum: primary card widths (global and per-tag) are now applied through CSS variables set by the forum JavaScript, instead of being compiled into the stylesheet.
- Backend: the discussion list only loads the first post when the text preview setting is enabled, and no longer declares its own `tags` include or `contentHtml` field (both are already provided by Flarum).
- Forum/Admin: all CSS classes added by the extension are now prefixed with `dc-` (kebab-case) so they no longer collide with other themes or extensions. **If you have custom CSS targeting the old class names, update it** (the old name is noted next to each renamed selector in `less/forum.less` and `less/admin.less`; these notes will be removed in a later version). Main renames:

  | Old | New |
  | --- | --- |
  | `.CardsListItem` / `.Card` / `.List` | `.dc-item` / `.dc-item--card` / `.dc-item--list` |
  | `.flexCard` | `.dc-primary-cards` |
  | `.cardLink`, `.cardTitle`, `.cardTags`, `.cardTag`, `.cardBadges`, `.cardBadge`, `.cardSpacer`, `.cardGrid` | `.dc-card-link`, `.dc-card-title`, `.dc-card-tags`, `.dc-card-tag`, `.dc-card-badges`, `.dc-card-badge`, `.dc-card-spacer`, `.dc-card-grid` |
  | `.cardFoot` | `.dc-card-footer` |
  | `.wrapImg` / `.After` / `.imgStub` | `.dc-wrap-img` / `.dc-wrap-img--shade` / `.dc-img-stub` |
  | `.previewPost` / `.previewCardImg` / `.terminalPost` | `.dc-preview-post` / `.dc-preview-card-img` / `.dc-terminal-post` |
  | `.Replies`, `.Left`, `.Right`, `.Avatars`, `.Arrow`, `.ReplyCount`, `.Avatar--mini` | `.dc-replies`, `.dc-replies-left`, `.dc-replies-right`, `.dc-replies-avatars`, `.dc-replies-arrow`, `.dc-reply-count`, `.dc-avatar-mini` |
  | `.flexBox`, `.rowSpan-*`, `.colSpan-*` | `.dc-flex-box`, `.dc-row-span-*`, `.dc-col-span-*` |
  | `.imageLabel`, `.discussionViews`, `.discussionReplyCount`, `.labelIcon` | `.dc-image-label`, `.dc-image-label--views`, `.dc-image-label--replies`, `.dc-label-icon` |
  | `.Hidden` (cards) / `.overflowing` / `h2.title` | `.dc-item--hidden` / `.dc-overflowing` / `h2.dc-card-heading` |
  | `.Author` / `.Date` (card footer) | `.dc-author` / `.dc-date` |
  | `@keyframes scroll` | `@keyframes dc-scroll` |
- Admin: the stylesheet no longer styles every modal of the admin panel (`.Modal-body`), it now only targets the extension's own modals. Admin class names (`DC-*`, `DiscussionCardsSettings`, `Debug-discussion`, …) were normalized to `dc-*` as well.
- Admin: the discussion check in the debug modal now reports the real decision of the card image resolver (source picked, reason, actual file, skipped sources with their reason) instead of always showing a computed `discussion-*.webp` name, which was wrong for default images and for rejected or failed external images. Note: this check can generate the card image file, like a regeneration.
- Backend: discussions saved before 2.1.0 with an external image URL keep it as is until their card image is regenerated (use the regenerate tool, or the repair tool to find them).
- Backend: added a migration that removes the unused `walsgit_discussion_cards_showReadCards` setting left in the database by the first versions (the setting actually used is `markReadCards`).

### Fixed
- Console: `regenerate-images` pagination and the `--without [-w]` selection (including when used alone) now work properly.
- Console/Admin: the regenerate summary no longer reports discussions as successfully regenerated when nothing changed. It now distinguishes regenerated, unchanged and "without available image" discussions (no image in the first post and no tag or general default image) and errors, and hints at setting a default image for the latter.
- Console: `migrate-images` used translation keys that did not exist (with dashes instead of underscores).
- Backend: tag default image file names are now built from the loaded tag instead of the route parameter.
- Admin: the Info tool no longer fails when listing folder status (non-static method called statically).
- Forum: the `phone` and `tablet` media queries in the stylesheet were invalid and are now applied.
- Backend: the forum stylesheet no longer loads every tag from the database at compile time, and no longer needs recompiling when a tag's card width changes.
- Admin: the "extension active" check now parses the enabled extensions list and compares exact ids, instead of searching the raw setting string (an extension with a similar name was reported as enabled; a missing or invalid value no longer breaks the page).
- Admin: the per-tag activation state in the tag edit modal now compares tag ids as strings.
- Console: `--popular [-p]` / `--unpopular [-u]` now break ties in view counts by discussion id (most recent first).
- Console: `--popular [-p]` / `--unpopular [-u]` now show a warning when no "Discussion Views" extension is enabled, instead of only showing "No discussions to process".
- Forum: a card image that cannot be loaded (deleted file, changed domain...) is now replaced by the extension's placeholder image instead of a broken image. Admins also get a single short warning alert with a "Details" button that opens a list of the affected discussions.

## [2.0.3] - 2026-10-20
*Complementary security release.*

### Security
- Backend: Hardened the way remote card images are fetched (single dedicated service, timeouts, size limit, stricter validation of image addresses, redirects and dimensions).
- Backend: Hardened the detection of images hosted on your own forum, which are now strictly limited to files located in the `public` directory.

### Changed
- Backend: When an image can't be downloaded or optimized, the card now falls back to the tag's default image, then to the general default image, instead of using the original image address.
- Admin: The Admin Info tool and the debugging tool now show whether PHP GD supports WebP and the real size of local images.
- Console: Added a clear error message when the PHP GD extension has no WebP support.

## [2.0.2] - 2026-10-19
### Security
- Backend: the endpoints to upload/delete the general default image and the tags' default images now require administrator permissions (they were previously accessible to any visitor)
- Backend: the 2 MB size limit and the MIME type check on uploaded images are now enforced server-side
- Backend: card image deletion is now restricted to the extension's own `discussion-{id}-{hash}-{hash}.webp` files

### Fixed
- Backend: deleting a reply no longer deletes the discussion's card image (only the first post is considered)
- Backend: merged the two duplicate first post deletion listeners into one
- Forum: tags are no longer matched by substring when checking where cards are activated (activating tag 12 also activated tag 2)
- Forum: no more error when the current tag isn't in the store
- Forum: cards of deleted discussions now disappear immediately
- Forum: the card image is now refreshed after the first post is deleted (no more broken image until reload)

## [2.0.1] - 2026-05-11
### Added
- Admin Settings Page: Debug information tool in the Tools menu
- Backend: After install is completed, the command `php flarum discussion-cards:regenerate-images -l -t -N` will automatically run to generate card images for the 20 latest, top and newest discussion.
- Backend: missing typing

### Changed
- Backend: some minor refactoring, formatting and cleanup

### Fixed
- Admin Settings Page: missing locales
- Console: an Exception is now thrown when a discussion doesn't exist in the regenerate-images command.

## [2.0.0] - 2026-04-29
This is the first version compatible with Flarum V2.

### Added
- Admin Settings Page: warning message for 3rd party extension support
- Backend: a listener has been added to resolve a new card image for the discussion on first post deletion

### Changed
- Admin Settings Page: Some labels & help texts
- Admin Settings Page & Backend: 3rd party extensions' support & their URLs
- Backend: API routes & names to make them more consistent
- Backend: updated dependencies
- Backend: replaced custom UploadTagImageButton with the UploadImageButton component from Flarum 2.0 (and removed the custom UploadTagImageButton component used for V1)
- Backend: removed unnecessary helper
- Backend: moved all listeners to src/Listener (instead of src/Listeners) for consistency
- Updated README.md & CHANGELOG.md

### Fixed
- Primary Cards: on tag pages, custom width of cards set in tag settings weren't taken into account.
- Primary Cards: avatars' alignment on primary cards
- List Cards: reply count icon & number's positioning and size on the card when shown on the right side of the cards
- List Cards: reply count was always showing total replies instead of unread total when needed.
- Admin Settings Page: temporary fixed styling issues introduced by Flarum V2 (more details in this discussion: [here](https://discuss.flarum.org/d/39118-flarum-200-rc1-released-the-last-mile-to-20/19) & [here](https://discuss.flarum.org/d/39118-flarum-200-rc1-released-the-last-mile-to-20/39))
- Console: Regenerate-images command wasn't working properly when the --without (or -w) option was used.
- Console: when (re)generating card image on discussions where the first post was deleted (first_post_id = null in DB) an error was thrown instead of reverting to one of the defaults

___
_For legacy V1 Changelog see it [here](https://github.com/WalsGit/flarum-discussion-cards/blob/Flarum-1.x/CHANGELOG.md) on Github._