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
Also it changes how the setting to distinguish between read & unread discussion cards work: now the read discussions are filtred with a grayscale instead of the unread ones. As of `1.2.0` read discussion cards a no longer filtered with a grayscale but have just a lighter title and text.

### 3rd party extension support
- `flarumite/simple-discussion-views` : show discussion view count on cards
- As of version `1.1.0` added support for the `v17development/flarum-blog` extension. If activated, you can set to use the blog's extension images for blog posts' cards and/or their article summary as preview text on the cards.
- As of version `1.2.0` added support for the `shebaoting/repost` extension. If activated, you can set it so that when you click on the card `title` of a discussion starting with a url, it will open that url, and clicking anywhere else on the card will open the discussion as usual.
- As of version `1.3.0` added support for the `michaelbelgium/flarum-discussion-views` extension.

![Discussion Cards](https://i.postimg.cc/FsxNPWYk/flarum-ext-discussioncards-1.png)

### Notes
- Developed and tested on Flarum 1.8.7 then tested on 1.8.8.
- Thanks to whomever suggested on Discord to use the tags selection component (sorry, we can no longer access the messages on Discord to mention them properly).
- New settings page inspired by ``Friends of Flarum``'s [Best Answer](https://github.com/FriendsOfFlarum/best-answer) Extension.
- Additional tags settings based on ``@askvortsov``'s [Discussion Templates](https://github.com/askvortsov1/flarum-discussion-templates) Extension.
- Developped this with the help of AI (mainly ChatGPT, Cody & Gemini).

## Installation

Install with composer:

```sh
composer require walsgit/flarum-discussion-cards
```

## Updating

```sh
composer update walsgit/flarum-discussion-cards
php flarum migrate
php flarum cache:clear
```

## Links

- [Packagist](https://packagist.org/packages/walsgit/flarum-discussion-cards)
- [GitHub](https://github.com/walsgit/flarum-discussion-cards)
- [Discuss](https://discuss.flarum.org/d/36343-flarum-discussion-cards)
- [Donate](https://walsgit.github.io/Donations/)