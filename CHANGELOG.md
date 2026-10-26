# Changelog

## [Unreleased]
### Changed
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
### Fixed
- Admin: the "extension not fully supported" message for the Blog and Repost options now uses an existing translation key.
- Admin: the Info tool no longer fails when listing folder status (non-static method called statically).
- Forum: the `phone` and `tablet` media queries in the stylesheet were invalid and are now applied.
- Backend: the forum stylesheet no longer loads every tag from the database at compile time, and no longer needs recompiling when a tag's card width changes.
- Admin: the "extension active" check now parses the enabled extensions list and compares exact ids, instead of searching the raw setting string (an extension with a similar name was reported as enabled; a missing or invalid value no longer breaks the page).
- Admin: the per-tag activation state in the tag edit modal now compares tag ids as strings.

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