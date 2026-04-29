## Flarum Discussion Cards

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/walsgit/flarum-discussion-cards.svg)](https://packagist.org/packages/walsgit/flarum-discussion-cards) [![Total Downloads](https://img.shields.io/packagist/dt/walsgit/flarum-discussion-cards.svg)](https://packagist.org/packages/walsgit/flarum-discussion-cards) [![Donate here](https://img.shields.io/badge/donate-here-%23008e97)](https://walsgit.github.io/Donations/)

A [Flarum](https://flarum.org) extension (**Fork** of ``@Dem13n``'s [discussion-cards](https://github.com/Dem13n/discussion-cards)). Allows you to display discussions in the form of cards, the first image of the first post is used as a preview, if there are no images, a stub is displayed.

This *fork* adds ``new features`` where you can now set custom cards settings per tag page (different default image along with number and width of primary cards).
On the ``index page`` (all discussions), if a discussion has multiple tags with their own custom image set, the displayed image will be chosen according to these priority rules:
```
1. The image of the the highest positioned child primary tag of the highest positioned parent primary tag
2. The image of the highest positioned parent primary tag
3. The image of the secondary tag with the lowest id
4. The general default image
```
For full list of changes & new features, please refer to the CHANGELOG.md file.

## IMPORTANT NOTICE
Versions `2.0.0` and up will target Flarum V2.
Versions `1.4.x` will be the final versions targeting Flarum V1. No more new features will be added, but some bug fixes & security updates will still be provided (if necessary) until full support will be dropped sometime before the end of 2026 or early 2027. All future dev efforts will be for versions `2.0.0` and up targeting Flarum V2.

### 3rd party extension support
- Until version `1.3.0` `flarumite/simple-discussion-views` was supported to show discussion views count on cards (see replacement below)
- As of version `1.1.0` added support for the `v17development/flarum-blog` extension. If activated, you can set to use the blog's extension images for blog posts' cards and/or their article summary as preview text on the cards.
- As of version `1.2.0` added support for the `shebaoting/repost` extension. If activated, you can set it so that when you click on the card `title` of a discussion starting with a url, it will open that url, and clicking anywhere else on the card will open the discussion as usual.
- As of version `1.3.0` added support for the `michaelbelgium/flarum-discussion-views` extension.
- As of version `1.4.0` added support for the `fof/discussion-views` extension (replacing the abandoned flarumite/simple-discussion-views)

### CLI Commands
As of version `1.4.0` new CLI commands have been added to manage card images:
- `php flarum discussion-cards:migrate-images` (runs automatically on update).
- `php flarum discussion-cards:purge-images` to delete unused or all card images from server.
- `php flarum discussion-cards:regenerate-images` to regenerate card images or generate missing card images.
All details on how to use them can be found in the extension's wiki on github (See Documentation in the Links section below or in the Admin Settings Page). You can also add the `--help` flag to each command to list options.

![Discussion Cards](https://i.postimg.cc/FsxNPWYk/flarum-ext-discussioncards-1.png)

### Notes
- Developed and tested on Flarum 1.8.7 (first version released `1.0.0`) and last version `1.4.3` was developed and tested on Flarum 1.8.16.
- As of version `1.4.0` it requires a Flarum minimum version of 1.8.0.
- Thanks to whomever suggested on Discord to use the tags selection component (sorry, we can no longer access the messages on Discord to mention them properly).
- New settings page inspired by ``Friends of Flarum``'s [Best Answer](https://github.com/FriendsOfFlarum/best-answer) Extension.
- Additional tags settings based on ``@askvortsov``'s [Discussion Templates](https://github.com/askvortsov1/flarum-discussion-templates) Extension.
- Developed this with the help of AI (mainly ChatGPT, Gemini & Claude Code using Ollama Cloud models).

## Installation

Install with composer:

```sh
composer require walsgit/flarum-discussion-cards
```

## Updating
💡 If you're updating from version `1.3.0` or earlier TO version `1.4.0` or later not that the `discussion-cards:migrate-images` command will be automatically run to move and convert old images used for cards to new file structure and format (See changelog of version `1.4.0` for more details).

```sh
composer update walsgit/flarum-discussion-cards
php flarum migrate
php flarum cache:clear
```

## Links

- [Packagist](https://packagist.org/packages/walsgit/flarum-discussion-cards)
- [GitHub](https://github.com/walsgit/flarum-discussion-cards)
- [Documentation](https://github.com/WalsGit/flarum-discussion-cards/wiki)
- [Discuss](https://discuss.flarum.org/d/36343-flarum-discussion-cards)
- [Donate](https://walsgit.github.io/Donations/)