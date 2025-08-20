/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/forum/compat.js":
/*!*****************************!*\
  !*** ./src/forum/compat.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_CardItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/CardItem */ "./src/forum/components/CardItem.js");
/* harmony import */ var _components_ListItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/ListItem */ "./src/forum/components/ListItem.js");
/* harmony import */ var _components_LastReplies__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/LastReplies */ "./src/forum/components/LastReplies.js");
/* harmony import */ var _utils_craftTags__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/craftTags */ "./src/forum/utils/craftTags.js");
/* harmony import */ var _utils_craftBadges__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/craftBadges */ "./src/forum/utils/craftBadges.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  'walsgit/discussion/cards/components/CardItem': _components_CardItem__WEBPACK_IMPORTED_MODULE_0__["default"],
  'walsgit/discussion/cards/components/ListItem': _components_ListItem__WEBPACK_IMPORTED_MODULE_1__["default"],
  'walsgit/discussion/cards/components/LastReplies': _components_LastReplies__WEBPACK_IMPORTED_MODULE_2__["default"],
  'walsgit/discussion/cards/utils/craftTags': _utils_craftTags__WEBPACK_IMPORTED_MODULE_3__["default"],
  'walsgit/discussion/cards/utils/craftBadges': _utils_craftBadges__WEBPACK_IMPORTED_MODULE_4__["default"]
});

/***/ }),

/***/ "./src/forum/components/CardItem.js":
/*!******************************************!*\
  !*** ./src/forum/components/CardItem.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ cardItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_craftBadges__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/craftBadges */ "./src/forum/utils/craftBadges.js");
/* harmony import */ var _helpers_getPostImage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/getPostImage */ "./src/forum/helpers/getPostImage.js");
/* harmony import */ var _utils_craftTags__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/craftTags */ "./src/forum/utils/craftTags.js");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/humanTime */ "flarum/common/utils/humanTime");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/helpers/username */ "flarum/common/helpers/username");
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/forum/utils/DiscussionControls */ "flarum/forum/utils/DiscussionControls");
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/utils/string */ "flarum/common/utils/string");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _LastReplies__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./LastReplies */ "./src/forum/components/LastReplies.js");
/* harmony import */ var _helpers_compareTags__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../helpers/compareTags */ "./src/forum/helpers/compareTags.js");
/* harmony import */ var _helpers_isValideImageUrl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../helpers/isValideImageUrl */ "./src/forum/helpers/isValideImageUrl.js");
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! flarum/components/TerminalPost */ "flarum/components/TerminalPost");
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_15__);
















var cardItem = /*#__PURE__*/function (_Component) {
  function cardItem() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(cardItem, _Component);
  var _proto = cardItem.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.discussion = this.attrs.discussion;
  };
  _proto.view = function view() {
    var _discussion$lastPostN;
    var discussion = this.discussion;
    var settings = {};
    for (var key in app.forum.data.attributes) {
      if (key.startsWith('walsgitDiscussionCards')) {
        var newKey = key.replace('walsgitDiscussionCards', '');
        newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
        settings[newKey] = app.forum.data.attributes[key];
      }
    }

    /* Getting & setting relevant info for 3rd party Views extensions support: Flarumite and MichaelBelgium */
    var viewsActivated = 'flarumite-simple-discussion-views' in flarum.extensions;
    var isViewsSet = discussion.data.attributes.hasOwnProperty('views');
    var mbViewsActivated = 'michaelbelgium-discussion-views' in flarum.extensions;
    var isViewCountSet = discussion.data.attributes.hasOwnProperty('viewCount');
    var viewsCount = viewsActivated && isViewsSet ? discussion.views() : mbViewsActivated && isViewCountSet ? discussion.viewCount() : NaN;

    /* Getting & setting relevant info for 3rd party Flarum Blog extension support */
    var blogActivated = app.forum.data.attributes.hasOwnProperty('blogTags');
    var blogSettings = {};
    var postIsBlogType = discussion.data.relationships.hasOwnProperty('blogMeta');
    var blogPost = {};
    if (blogActivated) {
      blogSettings.tags = app.forum.attribute('blogTags');
      blogSettings.defaultImage = app.forum.attribute('blogDefaultImage');
      if (postIsBlogType) {
        var blogPostsData = discussion.store.data.blogMeta[discussion.data.relationships.blogMeta.data.id];
        if ((0,_helpers_isValideImageUrl__WEBPACK_IMPORTED_MODULE_14__["default"])(blogPostsData.attribute('featuredImage'))) {
          blogPost.featuredImage = blogPostsData.attribute('featuredImage');
        }
      }
    }

    /* Getting & setting relevant info for 3rd party Repost extension */
    var repostActivated = 'shebaoting-repost' in flarum.extensions;
    var repostUrl = discussion.data.attributes.original_url || null;
    var isTagPage = m.route.get().split('?')[0].startsWith('/t/');
    var tagId;
    if (isTagPage) {
      var _m$route$get$split$;
      var slug = (_m$route$get$split$ = m.route.get().split('/t/')[1]) == null ? void 0 : _m$route$get$split$.split('?')[0];
      tagId = app.store.all('tags').find(function (t) {
        return t.slug() === slug;
      }).data.id;
      var tag = app.store.all('tags').find(function (t) {
        return t.id() === tagId;
      });
      var tagSettings = tag ? JSON.parse(tag.data.attributes.walsgitDiscussionCardsTagSettings || '{}') : {};
      var tagImage = tag ? tag.data.attributes.walsgitDiscussionCardsTagDefaultImage : null;
      tagSettings.defaultImage = tagImage;
      /* In case Flarum Blog Extension and useBlogImage are activated  */
      if (blogActivated && Number(settings.useBlogImages) === 1 && blogSettings.tags.includes(tagId)) {
        tagSettings.defaultImage = postIsBlogType && blogPost.featuredImage && (0,_helpers_isValideImageUrl__WEBPACK_IMPORTED_MODULE_14__["default"])(blogPost.featuredImage) ? blogPost.featuredImage : blogSettings.defaultImage;
      }
      for (var _key in tagSettings) {
        if (settings.hasOwnProperty(_key) && tagSettings[_key] !== settings[_key] && tagSettings[_key] !== null) {
          settings[_key] = tagSettings[_key];
        }
      }
    }

    /* On the IndexPage (all discussions) checks which default image to show based on tag priority */
    var isIndexPage = m.route.get().split('?')[0] === '/';
    if (isIndexPage) {
      var tags = discussion.tags();
      for (var _key2 in tags) {
        var _tagId = tags[_key2].id();
        var isChild = tags[_key2].isChild();
        var parent = tags[_key2].data.hasOwnProperty('relationships') && tags[_key2].parent() ? tags[_key2].parent()['data'].id : null;
        var position = tags[_key2].position();
        var tagCustomImg = tags[_key2].attribute('walsgitDiscussionCardsTagDefaultImage');
        /* In case Flarum Blog Extension and useBlogImage are activated  */
        if (blogActivated && Number(settings.useBlogImages) === 1 && blogSettings.tags.includes(_tagId)) {
          tagCustomImg = postIsBlogType && blogPost.featuredImage && (0,_helpers_isValideImageUrl__WEBPACK_IMPORTED_MODULE_14__["default"])(blogPost.featuredImage) ? blogPost.featuredImage : blogSettings.defaultImage;
        }
        var currentTag = {
          id: _tagId,
          isChild: isChild,
          parent: parent,
          position: position,
          tagCustomImg: tagCustomImg
        };
        var priorityTag = null;
        if (!settings.allowedTags.includes(_tagId) || tagCustomImg === null) continue;
        if (priorityTag === null || (0,_helpers_compareTags__WEBPACK_IMPORTED_MODULE_13__["default"])(currentTag, priorityTag) < 0) {
          priorityTag = {
            id: _tagId,
            isChild: isChild,
            parent: parent,
            position: position,
            tagCustomImg: tagCustomImg
          };
          settings.defaultImage = tagCustomImg;
        }
      }
    }
    var isRead = Number(settings.markReadCards) === 1 && discussion.isRead() && app.session.user ? "read" : "";
    var attrs = {};
    attrs.className = "wrapImg" + (Number(settings.showAuthor) === 1 ? " After" : "");
    var image = (0,_helpers_getPostImage__WEBPACK_IMPORTED_MODULE_3__["default"])(discussion.firstPost(), settings.defaultImage, postIsBlogType);
    var media = image ? m("img", {
      src: image,
      className: "previewCardImg",
      alt: discussion.title(),
      loading: "lazy"
    }) : m("div", {
      className: "imgStub"
    });

    /* Jump to the last relevant post (first unread or last post) */
    var jumpTo = Math.min((_discussion$lastPostN = discussion.lastPostNumber()) != null ? _discussion$lastPostN : 0, (discussion.lastReadPostNumber() || 0) + 1);

    /* setting post counts & text */
    var replyText = discussion.unreadCount() ? app.translator.trans("walsgit_discussion_cards.forum.unreadReplies", {
      count: discussion.unreadCount()
    }) : app.translator.trans("walsgit_discussion_cards.forum.replies", {
      count: discussion.replyCount() || "0"
    });
    return m("div", {
      key: discussion.id(),
      "data-id": discussion.id(),
      "data-tag-id": isTagPage ? tagId : null,
      className: "CardsListItem Card " + isRead + (discussion.isHidden() ? " Hidden" : "")
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9___default().controls(discussion, this).toArray().length ? m((flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8___default()), {
      icon: "fas fa-ellipsis-v",
      className: "DiscussionListItem-controls",
      buttonClassName: "Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right"
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9___default().controls(discussion, this).toArray()) : "", m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10___default()), {
      href: app.route.discussion(discussion, jumpTo),
      className: "cardLink"
    }, Number(settings.showBadges) === 1 ? (0,_utils_craftBadges__WEBPACK_IMPORTED_MODULE_2__["default"])(discussion.badges().toArray()) : "", m("div", attrs, (isViewsSet || isViewCountSet) && m('[', null, Number(settings.showViews) === 1 && !isNaN(viewsCount) ? m("div", {
      className: "imageLabel discussionViews"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default()("fas fa-eye", {
      className: "labelIcon"
    }), viewsCount) : ""), media, Number(settings.showAuthor) === 1 ? m("div", {
      className: "cardFoot"
    }, m("div", {
      className: "Author"
    }, flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_7___default()(discussion.user())), m("div", {
      className: "Date"
    }, flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5___default()(discussion.createdAt()))) : ""), m("div", {
      className: "cardTags"
    }, (0,_utils_craftTags__WEBPACK_IMPORTED_MODULE_4__["default"])(discussion.tags())), m("div", {
      className: "cardTitle"
    }, m("h2", {
      title: discussion.title(),
      className: "title"
    }, Number(settings.allowRepostLinks) === 1 && repostActivated && repostUrl ? m("a", {
      href: repostUrl,
      onclick: function onclick(e) {
        return e.stopPropagation();
      }
    }, (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__.truncate)(discussion.title(), 80)) : (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__.truncate)(discussion.title(), 80))), Number(settings.previewText) === 1 && discussion.firstPost() ? m("div", {
      className: "previewPost"
    }, blogActivated && Number(settings.useBlogSummary) === 1 && discussion.data.relationships.hasOwnProperty('blogMeta') && discussion.blogMeta().summary() !== '' ? (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__.truncate)(discussion.blogMeta().summary(), 150) : (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__.truncate)(discussion.firstPost().contentPlain(), 150)) : "", Number(settings.showLastPostInfo) === 1 && discussion.firstPost() ? m("div", {
      className: "terminalPost"
    }, m((flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_15___default()), {
      discussion: discussion,
      lastPost: discussion.lastPostNumber()
    })) : '', Number(settings.showReplies) === 1 ? m("div", {
      className: "cardSpacer"
    }, m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10___default()), {
      className: "Replies",
      href: app.route.discussion(discussion, discussion.lastPostNumber())
    }, m("div", {
      className: "Left"
    }, m("div", {
      className: "Avatars"
    }, m(_LastReplies__WEBPACK_IMPORTED_MODULE_12__["default"], {
      discussion: discussion
    })), m("div", {
      className: "Repcount"
    }, replyText)), m("div", {
      className: "Arrow"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default()("fas fa-angle-right")))) : ""));
  };
  return cardItem;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/LastReplies.js":
/*!*********************************************!*\
  !*** ./src/forum/components/LastReplies.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LastReplies)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/helpers/avatar */ "flarum/common/helpers/avatar");
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_2__);



var LastReplies = /*#__PURE__*/function (_Component) {
  function LastReplies() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(LastReplies, _Component);
  var _proto = LastReplies.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.discussion = this.attrs.discussion;
  };
  _proto.view = function view() {
    var discussion = this.discussion;

    // let's assume that the last 10 posts will be enough for us to identify 3 unique users
    var posts = discussion.posts().splice(-10);
    var filteredPosts = posts.filter(function (post) {
      return !post.isHidden() && post.number() !== 1 && post.contentType() === "comment";
    }).sort(function (a, b) {
      return b.createdAt() - a.createdAt();
    });
    var groupedUsers = filteredPosts.map(function (post) {
      return post.user();
    }).filter(function (user, i, self) {
      return self.indexOf(user) === i;
    }).reverse()
    // last 3 users
    .splice(-3);
    return groupedUsers.map(function (user) {
      return flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_2___default()(user, {
        className: 'Avatar--mini'
      });
    });
  };
  return LastReplies;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/ListItem.js":
/*!******************************************!*\
  !*** ./src/forum/components/ListItem.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_craftBadges__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/craftBadges */ "./src/forum/utils/craftBadges.js");
/* harmony import */ var _helpers_getPostImage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/getPostImage */ "./src/forum/helpers/getPostImage.js");
/* harmony import */ var _utils_craftTags__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/craftTags */ "./src/forum/utils/craftTags.js");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/humanTime */ "flarum/common/utils/humanTime");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/helpers/username */ "flarum/common/helpers/username");
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/forum/utils/DiscussionControls */ "flarum/forum/utils/DiscussionControls");
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/utils/string */ "flarum/common/utils/string");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _LastReplies__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./LastReplies */ "./src/forum/components/LastReplies.js");
/* harmony import */ var _helpers_compareTags__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../helpers/compareTags */ "./src/forum/helpers/compareTags.js");
/* harmony import */ var _helpers_isValideImageUrl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../helpers/isValideImageUrl */ "./src/forum/helpers/isValideImageUrl.js");
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! flarum/common/utils/abbreviateNumber */ "flarum/common/utils/abbreviateNumber");
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! flarum/components/TerminalPost */ "flarum/components/TerminalPost");
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_16__);

















var listItem = /*#__PURE__*/function (_Component) {
  function listItem() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(listItem, _Component);
  var _proto = listItem.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
  };
  _proto.view = function view() {
    var _discussion$lastPostN;
    var discussion = this.attrs.discussion;
    var settings = {};
    for (var key in app.forum.data.attributes) {
      if (key.startsWith('walsgitDiscussionCards')) {
        var newKey = key.replace('walsgitDiscussionCards', '');
        newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
        settings[newKey] = app.forum.data.attributes[key];
      }
    }

    /* Getting & setting relevant info for 3rd party Views extensions support: Flarumite and MichaelBelgium */
    var viewsActivated = 'flarumite-simple-discussion-views' in flarum.extensions;
    var isViewsSet = discussion.data.attributes.hasOwnProperty('views');
    var mbViewsActivated = 'michaelbelgium-discussion-views' in flarum.extensions;
    var isViewCountSet = discussion.data.attributes.hasOwnProperty('viewCount');
    var viewsCount = viewsActivated && isViewsSet ? discussion.views() : mbViewsActivated && isViewCountSet ? discussion.viewCount() : NaN;

    /* Getting & setting relevant info for 3rd party Flarum Blog support */
    var blogActivated = app.forum.data.attributes.hasOwnProperty('blogTags');
    var blogSettings = {};
    var postIsBlogType = discussion.data.relationships.hasOwnProperty('blogMeta');
    var blogPost = {};
    if (blogActivated) {
      blogSettings.tags = app.forum.attribute('blogTags');
      blogSettings.defaultImage = app.forum.attribute('blogDefaultImage');
      if (postIsBlogType) {
        var blogPostsData = discussion.store.data.blogMeta[discussion.data.relationships.blogMeta.data.id];
        if ((0,_helpers_isValideImageUrl__WEBPACK_IMPORTED_MODULE_14__["default"])(blogPostsData.attribute('featuredImage'))) {
          blogPost.featuredImage = blogPostsData.attribute('featuredImage');
        }
      }
    }

    /* Getting & setting relevant info for 3rd party Repost extension */
    var repostActivated = 'shebaoting-repost' in flarum.extensions;
    var repostUrl = discussion.data.attributes.original_url || null;
    var isTagPage = m.route.get().split('?')[0].startsWith('/t/');
    if (isTagPage) {
      var _m$route$get$split$;
      var slug = (_m$route$get$split$ = m.route.get().split('/t/')[1]) == null ? void 0 : _m$route$get$split$.split('?')[0];
      var tagId = app.store.all('tags').find(function (t) {
        return t.slug() === slug;
      }).data.id;
      var tag = app.store.all('tags').find(function (t) {
        return t.id() === tagId;
      });
      var tagSettings = tag ? JSON.parse(tag.data.attributes.walsgitDiscussionCardsTagSettings || '{}') : {};
      var tagImage = tag ? tag.data.attributes.walsgitDiscussionCardsTagDefaultImage : null;
      tagSettings.defaultImage = tagImage;
      /* In case Flarum Blog Extension and useBlogImage are activated  */
      if (blogActivated && Number(settings.useBlogImages) === 1 && blogSettings.tags.includes(tagId)) {
        tagSettings.defaultImage = postIsBlogType && blogPost.featuredImage && (0,_helpers_isValideImageUrl__WEBPACK_IMPORTED_MODULE_14__["default"])(blogPost.featuredImage) ? blogPost.featuredImage : blogSettings.defaultImage;
      }
      for (var _key in tagSettings) {
        if (settings.hasOwnProperty(_key) && tagSettings[_key] !== settings[_key] && tagSettings[_key] !== null) {
          settings[_key] = tagSettings[_key];
        }
      }
    }

    /* On the IndexPage (all discussions) checks which default image to show based on tag priority */
    var isIndexPage = m.route.get().split('?')[0] === '/';
    if (isIndexPage) {
      var tags = discussion.tags();
      for (var _key2 in tags) {
        var _tagId = tags[_key2].id();
        var isChild = tags[_key2].isChild();
        var parent = tags[_key2].data.hasOwnProperty('relationships') && tags[_key2].parent() ? tags[_key2].parent()['data'].id : null;
        var position = tags[_key2].position();
        var tagCustomImg = tags[_key2].attribute('walsgitDiscussionCardsTagDefaultImage');
        /* In case Flarum Blog Extension and useBlogImage are activated  */
        if (blogActivated && Number(settings.useBlogImages) === 1 && blogSettings.tags.includes(_tagId)) {
          tagCustomImg = postIsBlogType && blogPost.featuredImage && (0,_helpers_isValideImageUrl__WEBPACK_IMPORTED_MODULE_14__["default"])(blogPost.featuredImage) ? blogPost.featuredImage : blogSettings.defaultImage;
        }
        var currentTag = {
          id: _tagId,
          isChild: isChild,
          parent: parent,
          position: position,
          tagCustomImg: tagCustomImg
        };
        var priorityTag = null;
        if (!settings.allowedTags.includes(_tagId) || tagCustomImg === null) continue;
        if (priorityTag === null || (0,_helpers_compareTags__WEBPACK_IMPORTED_MODULE_13__["default"])(currentTag, priorityTag) < 0) {
          priorityTag = {
            id: _tagId,
            isChild: isChild,
            parent: parent,
            position: position,
            tagCustomImg: tagCustomImg
          };
          settings.defaultImage = tagCustomImg;
        }
      }
    }
    var isRead = Number(settings.markReadCards) === 1 && discussion.isRead() && app.session.user ? 'read' : '';
    var attrs = {};
    attrs.className = "wrapImg" + (Number(settings.showAuthor) === 1 ? " After" : '');
    var image = (0,_helpers_getPostImage__WEBPACK_IMPORTED_MODULE_3__["default"])(discussion.firstPost(), settings.defaultImage, postIsBlogType);
    var media = image ? m("img", {
      src: image,
      className: "previewCardImg",
      alt: discussion.title(),
      loading: "lazy"
    }) : m("div", {
      className: "imgStub"
    });

    /* Jump to the last relevant post (first unread or last post) */
    var jumpTo = Math.min((_discussion$lastPostN = discussion.lastPostNumber()) != null ? _discussion$lastPostN : 0, (discussion.lastReadPostNumber() || 0) + 1);

    /* setting post counts & text */
    var replyText = discussion.unreadCount() ? app.translator.trans("walsgit_discussion_cards.forum.unreadReplies", {
      count: discussion.unreadCount()
    }) : app.translator.trans("walsgit_discussion_cards.forum.replies", {
      count: discussion.replyCount() || "0"
    });
    var postCount = discussion.unreadCount() ? discussion.unreadCount() + "*" : discussion.replyCount();
    return m("div", {
      key: discussion.id(),
      "data-id": discussion.id(),
      className: "CardsListItem List " + isRead + (discussion.isHidden() ? " Hidden" : "")
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9___default().controls(discussion, this).toArray().length ? m((flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8___default()), {
      icon: 'fas fa-ellipsis-v',
      className: 'DiscussionListItem-controls',
      buttonClassName: 'Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right'
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_9___default().controls(discussion, this).toArray()) : '', m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10___default()), {
      href: app.route.discussion(discussion, jumpTo),
      className: "cardLink"
    }, Number(settings.showBadges) === 1 ? (0,_utils_craftBadges__WEBPACK_IMPORTED_MODULE_2__["default"])(discussion.badges().toArray()) : '', m("div", {
      className: "cardGrid"
    }, m("div", {
      className: "rowSpan-3 colSpan"
    }, m("div", attrs, (isViewsSet || isViewCountSet) && m('[', null, Number(settings.showViews) === 1 && !isNaN(viewsCount) ? m("div", {
      className: "imageLabel discussionViews"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default()('fas fa-eye', {
      className: 'labelIcon'
    }), viewsCount) : ''), media, Number(settings.showAuthor) === 1 ? m("div", {
      className: "cardFoot"
    }, m("div", {
      className: "Author"
    }, flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_7___default()(discussion.user())), m("div", {
      className: "Date"
    }, flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5___default()(discussion.createdAt()))) : '')), m("div", {
      className: "rowSpan-3 colSpan-2"
    }, m("div", {
      className: "flexBox"
    }, m("div", {
      className: "cardTitle"
    }, m("h2", {
      title: discussion.title(),
      className: "title"
    }, Number(settings.allowRepostLinks) === 1 && repostActivated && repostUrl ? m("a", {
      href: repostUrl,
      onclick: function onclick(e) {
        return e.stopPropagation();
      }
    }, (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__.truncate)(discussion.title(), 80)) : (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__.truncate)(discussion.title(), 80)), app.screen() !== 'phone' && Number(settings.showReplies) === 1 && Number(settings.showRepliesOnRight) === 1 ? m("div", {
      className: "DiscussionListItem-count"
    }, m("span", {
      "aria-hidden": "true"
    }, flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_15___default()(postCount)), m("span", {
      className: "visually-hidden"
    }, app.translator.trans('core.forum.discussion_list.unread_replies_a11y_label', {
      count: discussion.replyCount()
    }))) : ''), m("div", {
      className: "cardTags"
    }, (0,_utils_craftTags__WEBPACK_IMPORTED_MODULE_4__["default"])(discussion.tags()))), Number(settings.previewText) === 1 && discussion.firstPost() ? m("div", {
      className: "previewPost"
    }, blogActivated && Number(settings.useBlogSummary) === 1 && discussion.data.relationships.hasOwnProperty('blogMeta') && discussion.blogMeta().summary() !== '' ? (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__.truncate)(discussion.blogMeta().summary(), 150) : (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_11__.truncate)(discussion.firstPost().contentPlain(), 150)) : '', Number(settings.showLastPostInfo) === 1 && discussion.firstPost() ? m("div", {
      className: "terminalPost"
    }, m((flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_16___default()), {
      discussion: discussion,
      lastPost: discussion.lastPostNumber()
    })) : '', app.screen() === 'phone' && Number(settings.showReplies) === 1 ? m("div", {
      className: "cardSpacer"
    }, m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_10___default()), {
      className: "Replies",
      href: app.route.discussion(discussion, discussion.lastPostNumber())
    }, m("div", {
      className: "Left"
    }, m("div", {
      className: "Avatars"
    }, m(_LastReplies__WEBPACK_IMPORTED_MODULE_12__["default"], {
      discussion: discussion
    })), m("div", {
      className: "Repcount"
    }, replyText)), m("div", {
      className: "Arrow"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default()('fas fa-angle-right')))) : Number(settings.showReplies) === 1 && !Number(settings.showRepliesOnRight) ? m("div", {
      className: "imageLabel discussionReplyCount"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default()('fas fa-comment', {
      className: 'labelIcon'
    }), postCount) : ''))));
  };
  return listItem;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/helpers/checkOverflowingTags.js":
/*!***************************************************!*\
  !*** ./src/forum/helpers/checkOverflowingTags.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ checkOverflowingTags)
/* harmony export */ });
function checkOverflowingTags() {
  var cardListItemsOnPrimary = document.querySelectorAll(".CardsListItem.Card .cardLink");
  var cardListItems = document.querySelectorAll(".cardGrid .colSpan-2");
  var toggleOverflowClass = function toggleOverflowClass(cardTags, cardListItem) {
    if (!cardTags) return;
    if (cardTags.scrollWidth > cardListItem.clientWidth - 30) {
      // -30 to account for the 15px + 15px margins on .cardTags
      cardTags.classList.add("overflowing");
    } else {
      cardTags.classList.remove("overflowing");
    }
  };
  cardListItemsOnPrimary.forEach(function (cardListItem) {
    var cardTags = cardListItem.querySelector(".cardTags");
    toggleOverflowClass(cardTags, cardListItem);
  });
  cardListItems.forEach(function (cardListItem) {
    var cardTags = cardListItem.querySelector(".flexBox .cardTags");
    toggleOverflowClass(cardTags, cardListItem);
  });
}

/***/ }),

/***/ "./src/forum/helpers/compareTags.js":
/*!******************************************!*\
  !*** ./src/forum/helpers/compareTags.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ compareTags)
/* harmony export */ });
function compareTags(currentTag, priorityTag) {
  if (currentTag.isChild && !priorityTag.isChild) return -1;
  if (!currentTag.isChild && priorityTag.isChild) return 1;
  if (currentTag.isChild && priorityTag.isChild && currentTag.parent === priorityTag.parent) return currentTag.position - priorityTag.position;
  if (currentTag.isChild && priorityTag.isChild && currentTag.parent !== priorityTag.parent) return currentTag.parent - priorityTag.parent;
  if (!currentTag.position && priorityTag.position) return 1;
  if (currentTag.position && !priorityTag.position) return -1;
  if (currentTag.position && priorityTag.position) return currentTag.position - priorityTag.position;
  return currentTag.id - priorityTag.id;
}

/***/ }),

/***/ "./src/forum/helpers/getPostImage.js":
/*!*******************************************!*\
  !*** ./src/forum/helpers/getPostImage.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getPostImage)
/* harmony export */ });
/* harmony import */ var _isValideImageUrl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isValideImageUrl */ "./src/forum/helpers/isValideImageUrl.js");

function getPostImage(post, image, isblogPost, key) {
  if (isblogPost === void 0) {
    isblogPost = false;
  }
  if (key === void 0) {
    key = 1;
  }
  var regex = /<img(?!.*?class="emoji").*?src=[\'"](.*?)[\'"].*?>|background(?:-image)?:\s*url\(['"]?(.*?)['"]?\)/i;
  if (isblogPost && (0,_isValideImageUrl__WEBPACK_IMPORTED_MODULE_0__["default"])(image)) {
    return image;
  }
  var assetImage = app.forum.attribute("baseUrl") + "/assets/" + image;
  if (post) {
    var src = regex.exec(post.contentHtml());
    if (typeof key === "number" && key > 0) {
      return src ? src[1] || src[2] : image ? assetImage : null;
    } else if (key === '~') {
      return src;
    } else {
      return null;
    }
  }
}

/***/ }),

/***/ "./src/forum/helpers/isValideImageUrl.js":
/*!***********************************************!*\
  !*** ./src/forum/helpers/isValideImageUrl.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isValideImageUrl)
/* harmony export */ });
function isValideImageUrl(url) {
  if (typeof url !== 'string') return false;
  var imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  var parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (_unused) {
    return false;
  }
  var extension = parsedUrl.pathname.split('.').pop().toLowerCase();
  return imageExtensions.includes(extension);
}

/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/DiscussionList */ "flarum/forum/components/DiscussionList");
/* harmony import */ var flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/states/DiscussionListState */ "flarum/forum/states/DiscussionListState");
/* harmony import */ var flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Placeholder */ "flarum/common/components/Placeholder");
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_CardItem__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/CardItem */ "./src/forum/components/CardItem.js");
/* harmony import */ var _components_ListItem__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/ListItem */ "./src/forum/components/ListItem.js");
/* harmony import */ var _helpers_checkOverflowingTags__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./helpers/checkOverflowingTags */ "./src/forum/helpers/checkOverflowingTags.js");
/* harmony import */ var _compat__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./compat */ "./src/forum/compat.js");
/* harmony import */ var _flarum_core_forum__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @flarum/core/forum */ "@flarum/core/forum");
/* harmony import */ var _flarum_core_forum__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_flarum_core_forum__WEBPACK_IMPORTED_MODULE_12__);











flarum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('walsgit/discussion/cards', function () {
  (0,flarum_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oncreate', _helpers_checkOverflowingTags__WEBPACK_IMPORTED_MODULE_10__["default"]);
  (0,flarum_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'onupdate', _helpers_checkOverflowingTags__WEBPACK_IMPORTED_MODULE_10__["default"]);
  (0,flarum_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'requestParams', function (params) {
    if (flarum_app__WEBPACK_IMPORTED_MODULE_0___default().current.matches((flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default()))) {
      params.include.push(['firstPost', 'posts', 'posts.user']);
    }
  });
  (0,flarum_extend__WEBPACK_IMPORTED_MODULE_1__.override)((flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'view', function (original) {
    var settings = {};
    for (var key in (flarum_app__WEBPACK_IMPORTED_MODULE_0___default().forum).data.attributes) {
      if (key.startsWith('walsgitDiscussionCards')) {
        var newKey = key.replace('walsgitDiscussionCards', '');
        newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
        settings[newKey] = (flarum_app__WEBPACK_IMPORTED_MODULE_0___default().forum).data.attributes[key];
      }
    }
    var state = this.attrs.state;
    var params = state.getParams();
    var loading;
    if (state.isInitialLoading() || state.isLoadingNext()) {
      loading = m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default()), null);
    } else if (state.hasNext()) {
      loading = flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default().component({
        className: 'Button',
        onclick: state.loadNext.bind(state)
      }, flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('core.forum.discussion_list.load_more_button'));
    }
    if (state.isEmpty()) {
      var text = flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('core.forum.discussion_list.empty_text');
      return m("div", {
        className: "DiscussionList"
      }, m((flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_6___default()), {
        text: text
      }));
    }
    var isTagPage = m.route.get().split('?')[0].startsWith('/t/');
    var tag = null;
    if (isTagPage) {
      tag = flarum_app__WEBPACK_IMPORTED_MODULE_0___default().store.all('tags').find(function (t) {
        return t.slug() === params.tags;
      }).data.id;
      var tagSettings = JSON.parse(flarum_app__WEBPACK_IMPORTED_MODULE_0___default().store.all('tags').find(function (t) {
        return t.slug() === params.tags;
      }).data.attributes.walsgitDiscussionCardsTagSettings);
      for (var _key in tagSettings) {
        if (settings.hasOwnProperty(_key) && tagSettings[_key] !== settings[_key]) {
          settings[_key] = tagSettings[_key];
        }
      }
    }
    if (flarum_app__WEBPACK_IMPORTED_MODULE_0___default().current.matches((flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default())) && (settings.allowedTags.length && settings.allowedTags.includes(tag) || !params.tags && Number(settings.onIndexPage) === 1)) {
      return m("div", {
        className: 'DiscussionList' + (state.isSearchResults() ? ' DiscussionList--searchResults' : '')
      }, m("div", {
        "class": "DiscussionList-discussions flexCard"
      }, state.getPages().map(function (pg, o) {
        return pg.items.map(function (discussion, i) {
          return i < Number(settings.primaryCards) && o === 0 ? m(_components_CardItem__WEBPACK_IMPORTED_MODULE_8__["default"], {
            discussion: discussion
          }) : m(_components_ListItem__WEBPACK_IMPORTED_MODULE_9__["default"], {
            discussion: discussion
          });
        });
      })), m("div", {
        className: "DiscussionList-loadMore"
      }, loading));
    } else {
      return original();
    }
  });
}, -1);

// Expose compat API


Object.assign(_flarum_core_forum__WEBPACK_IMPORTED_MODULE_12__.compat, _compat__WEBPACK_IMPORTED_MODULE_11__["default"]);

/***/ }),

/***/ "./src/forum/utils/craftBadges.js":
/*!****************************************!*\
  !*** ./src/forum/utils/craftBadges.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ craftBadges)
/* harmony export */ });
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_1__);


function craftBadges(badges) {
  if (badges.length) {
    return [m('.cardBadges', [badges.map(function (badge) {
      return [m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_1___default()), {
        text: badge.attrs.label ? badge.attrs.label[0] : '',
        position: 'right'
      }, m('span.cardBadge.Badge.Badge--' + badge.attrs.type, [flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_0___default()(badge.attrs.icon)]))];
    })])];
  }
}
;

/***/ }),

/***/ "./src/forum/utils/craftTags.js":
/*!**************************************!*\
  !*** ./src/forum/utils/craftTags.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ craftTags)
/* harmony export */ });
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_tags_utils_sortTags__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/tags/utils/sortTags */ "flarum/tags/utils/sortTags");
/* harmony import */ var flarum_tags_utils_sortTags__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_utils_sortTags__WEBPACK_IMPORTED_MODULE_1__);


function craftTags(tags) {
  if (tags) {
    return [flarum_tags_utils_sortTags__WEBPACK_IMPORTED_MODULE_1___default()(tags).map(function (tag) {
      return [m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_0___default()), {
        className: "cardTag",
        style: {
          backgroundColor: tag.color()
        },
        href: app.route('tag', {
          tags: tag.slug()
        })
      }, tag.name())];
    })];
  }
}
;

/***/ }),

/***/ "@flarum/core/forum":
/*!******************************!*\
  !*** external "flarum.core" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core;

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/Dropdown":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['common/components/Dropdown']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Dropdown'];

/***/ }),

/***/ "flarum/common/components/Link":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/components/Link']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Link'];

/***/ }),

/***/ "flarum/common/components/LoadingIndicator":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['common/components/LoadingIndicator']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LoadingIndicator'];

/***/ }),

/***/ "flarum/common/components/Placeholder":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['common/components/Placeholder']" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Placeholder'];

/***/ }),

/***/ "flarum/common/components/Tooltip":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['common/components/Tooltip']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Tooltip'];

/***/ }),

/***/ "flarum/common/helpers/avatar":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/avatar']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/avatar'];

/***/ }),

/***/ "flarum/common/helpers/icon":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/icon']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/icon'];

/***/ }),

/***/ "flarum/common/helpers/username":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/username']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/username'];

/***/ }),

/***/ "flarum/common/utils/abbreviateNumber":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['common/utils/abbreviateNumber']" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/abbreviateNumber'];

/***/ }),

/***/ "flarum/common/utils/humanTime":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/utils/humanTime']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/humanTime'];

/***/ }),

/***/ "flarum/common/utils/string":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/string']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/string'];

/***/ }),

/***/ "flarum/components/TerminalPost":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['components/TerminalPost']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['components/TerminalPost'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/forum/components/DiscussionList":
/*!************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionList']" ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/DiscussionList'];

/***/ }),

/***/ "flarum/forum/components/IndexPage":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/IndexPage']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/IndexPage'];

/***/ }),

/***/ "flarum/forum/states/DiscussionListState":
/*!*************************************************************************!*\
  !*** external "flarum.core.compat['forum/states/DiscussionListState']" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/states/DiscussionListState'];

/***/ }),

/***/ "flarum/forum/utils/DiscussionControls":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['forum/utils/DiscussionControls']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/utils/DiscussionControls'];

/***/ }),

/***/ "flarum/tags/utils/sortTags":
/*!************************************************************!*\
  !*** external "flarum.core.compat['tags/utils/sortTags']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/utils/sortTags'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t, o);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");
/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map