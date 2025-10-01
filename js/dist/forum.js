/******/ (() => { // webpackBootstrap
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
/* harmony export */   "default": () => (/* binding */ CardItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_craftBadges__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/craftBadges */ "./src/forum/utils/craftBadges.js");
/* harmony import */ var _utils_craftTags__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/craftTags */ "./src/forum/utils/craftTags.js");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/humanTime */ "flarum/common/utils/humanTime");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/helpers/username */ "flarum/common/helpers/username");
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/forum/utils/DiscussionControls */ "flarum/forum/utils/DiscussionControls");
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! flarum/common/utils/string */ "flarum/common/utils/string");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _LastReplies__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./LastReplies */ "./src/forum/components/LastReplies.js");
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! flarum/components/TerminalPost */ "flarum/components/TerminalPost");
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _helpers_resolveCardImage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../helpers/resolveCardImage */ "./src/forum/helpers/resolveCardImage.js");
















var CardItem = /*#__PURE__*/function (_Component) {
  function CardItem() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(CardItem, _Component);
  var _proto = CardItem.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.discussion = this.attrs.discussion;
    this.imageUrl = null;
    this.loadImage();
  };
  _proto.loadImage = /*#__PURE__*/function () {
    var _loadImage = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0,_helpers_resolveCardImage__WEBPACK_IMPORTED_MODULE_15__["default"])(this.discussion);
          case 2:
            this.imageUrl = _context.sent;
            m.redraw();
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function loadImage() {
      return _loadImage.apply(this, arguments);
    }
    return loadImage;
  }();
  _proto.view = function view() {
    var _discussion$lastPostN;
    var discussion = this.discussion;
    var settings = {};
    for (var key in app.forum.data.attributes) {
      if (key.startsWith("walsgitDiscussionCards")) {
        var newKey = key.replace("walsgitDiscussionCards", "");
        newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
        settings[newKey] = app.forum.data.attributes[key];
      }
    }

    /* Getting & setting relevant info for 3rd party Views extensions support: Flarumite and MichaelBelgium */
    var viewsActivated = "flarumite-simple-discussion-views" in flarum.extensions;
    var isViewsSet = discussion.data.attributes.hasOwnProperty("views");
    var mbViewsActivated = "michaelbelgium-discussion-views" in flarum.extensions;
    var isViewCountSet = discussion.data.attributes.hasOwnProperty("viewCount");
    var viewsCount = viewsActivated && isViewsSet ? discussion.views() : mbViewsActivated && isViewCountSet ? discussion.viewCount() : NaN;

    /* Getting & setting relevant info for 3rd party Repost extension */
    var repostActivated = "shebaoting-repost" in flarum.extensions;
    var repostUrl = discussion.data.attributes.original_url || null;
    var isRead = Number(settings.markReadCards) === 1 && discussion.isRead() && app.session.user ? "read" : "";
    var attrs = {
      className: "wrapImg" + (Number(settings.showAuthor) === 1 ? " After" : "")
    };

    /* Card image */
    var media = this.imageUrl ? m("img", {
      src: this.imageUrl,
      className: "previewCardImg",
      alt: discussion.title(),
      loading: "lazy"
    }) : m("div", {
      className: "imgStub"
    });

    /* Jump to the last relevant post (first unread or last post) */
    var jumpTo = Math.min((_discussion$lastPostN = discussion.lastPostNumber()) != null ? _discussion$lastPostN : 0, (discussion.lastReadPostNumber() || 0) + 1);

    /* Setting post counts & text */
    var replyText = discussion.unreadCount() ? app.translator.trans("walsgit_discussion_cards.forum.unreadReplies", {
      count: discussion.unreadCount()
    }) : app.translator.trans("walsgit_discussion_cards.forum.replies", {
      count: discussion.replyCount() || "0"
    });
    return m("div", {
      key: discussion.id(),
      "data-id": discussion.id(),
      className: "CardsListItem Card " + isRead + (discussion.isHidden() ? " Hidden" : "")
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10___default().controls(discussion, this).toArray().length ? m((flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_9___default()), {
      icon: "fas fa-ellipsis-v",
      className: "DiscussionListItem-controls",
      buttonClassName: "Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right"
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10___default().controls(discussion, this).toArray()) : "", m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11___default()), {
      href: app.route.discussion(discussion, jumpTo),
      className: "cardLink"
    }, Number(settings.showBadges) === 1 ? (0,_utils_craftBadges__WEBPACK_IMPORTED_MODULE_4__["default"])(discussion.badges().toArray()) : "", m("div", attrs, (isViewsSet || isViewCountSet) && Number(settings.showViews) === 1 && !isNaN(viewsCount) && m("div", {
      className: "imageLabel discussionViews"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default()("fas fa-eye", {
      className: "labelIcon"
    }), viewsCount), media, Number(settings.showAuthor) === 1 && m("div", {
      className: "cardFoot"
    }, m("div", {
      className: "Author"
    }, flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8___default()(discussion.user())), m("div", {
      className: "Date"
    }, flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_6___default()(discussion.createdAt())))), m("div", {
      className: "cardTags"
    }, (0,_utils_craftTags__WEBPACK_IMPORTED_MODULE_5__["default"])(discussion.tags())), m("div", {
      className: "cardTitle"
    }, m("h2", {
      title: discussion.title(),
      className: "title"
    }, Number(settings.allowRepostLinks) === 1 && repostActivated && repostUrl ? m("a", {
      href: repostUrl,
      onclick: function onclick(e) {
        return e.stopPropagation();
      }
    }, (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__.truncate)(discussion.title(), 80)) : (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__.truncate)(discussion.title(), 80))), Number(settings.previewText) === 1 && discussion.firstPost() && m("div", {
      className: "previewPost"
    }, (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__.truncate)(discussion.firstPost().contentPlain(), 150)), Number(settings.showLastPostInfo) === 1 && discussion.firstPost() && m("div", {
      className: "terminalPost"
    }, m((flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_14___default()), {
      discussion: discussion,
      lastPost: discussion.lastPostNumber()
    })), Number(settings.showReplies) === 1 && m("div", {
      className: "cardSpacer"
    }, m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11___default()), {
      className: "Replies",
      href: app.route.discussion(discussion, discussion.lastPostNumber())
    }, m("div", {
      className: "Left"
    }, m("div", {
      className: "Avatars"
    }, m(_LastReplies__WEBPACK_IMPORTED_MODULE_13__["default"], {
      discussion: discussion
    })), m("div", {
      className: "Repcount"
    }, replyText)), m("div", {
      className: "Arrow"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default()("fas fa-angle-right"))))));
  };
  return CardItem;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_3___default()));


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
/* harmony export */   "default": () => (/* binding */ ListItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_craftBadges__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/craftBadges */ "./src/forum/utils/craftBadges.js");
/* harmony import */ var _utils_craftTags__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/craftTags */ "./src/forum/utils/craftTags.js");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/humanTime */ "flarum/common/utils/humanTime");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/helpers/username */ "flarum/common/helpers/username");
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/forum/utils/DiscussionControls */ "flarum/forum/utils/DiscussionControls");
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! flarum/common/utils/string */ "flarum/common/utils/string");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _LastReplies__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./LastReplies */ "./src/forum/components/LastReplies.js");
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! flarum/common/utils/abbreviateNumber */ "flarum/common/utils/abbreviateNumber");
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! flarum/components/TerminalPost */ "flarum/components/TerminalPost");
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _helpers_resolveCardImage__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../helpers/resolveCardImage */ "./src/forum/helpers/resolveCardImage.js");

















var ListItem = /*#__PURE__*/function (_Component) {
  function ListItem() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(ListItem, _Component);
  var _proto = ListItem.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.discussion = this.attrs.discussion;
    this.imageUrl = null;
    this.loadImage();
  };
  _proto.loadImage = /*#__PURE__*/function () {
    var _loadImage = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0,_helpers_resolveCardImage__WEBPACK_IMPORTED_MODULE_16__["default"])(this.discussion);
          case 2:
            this.imageUrl = _context.sent;
            m.redraw();
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function loadImage() {
      return _loadImage.apply(this, arguments);
    }
    return loadImage;
  }();
  _proto.view = function view() {
    var _discussion$lastPostN;
    var discussion = this.attrs.discussion;
    var settings = {};
    for (var key in app.forum.data.attributes) {
      if (key.startsWith("walsgitDiscussionCards")) {
        var newKey = key.replace("walsgitDiscussionCards", "");
        newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
        settings[newKey] = app.forum.data.attributes[key];
      }
    }

    /* Getting & setting relevant info for 3rd party Views extensions support: Flarumite and MichaelBelgium */
    var viewsActivated = "flarumite-simple-discussion-views" in flarum.extensions;
    var isViewsSet = discussion.data.attributes.hasOwnProperty("views");
    var mbViewsActivated = "michaelbelgium-discussion-views" in flarum.extensions;
    var isViewCountSet = discussion.data.attributes.hasOwnProperty("viewCount");
    var viewsCount = viewsActivated && isViewsSet ? discussion.views() : mbViewsActivated && isViewCountSet ? discussion.viewCount() : NaN;

    /* Getting & setting relevant info for 3rd party Repost extension */
    var repostActivated = "shebaoting-repost" in flarum.extensions;
    var repostUrl = discussion.data.attributes.original_url || null;
    var isRead = Number(settings.markReadCards) === 1 && discussion.isRead() && app.session.user ? "read" : "";
    var attrs = {
      className: "wrapImg" + (Number(settings.showAuthor) === 1 ? " After" : "")
    };

    /* Card image */
    var media = this.imageUrl ? m("img", {
      src: this.imageUrl,
      className: "previewCardImg",
      alt: discussion.title(),
      loading: "lazy"
    }) : m("div", {
      className: "imgStub"
    });

    /* Jump to the last relevant post (first unread or last post) */
    var jumpTo = Math.min((_discussion$lastPostN = discussion.lastPostNumber()) != null ? _discussion$lastPostN : 0, (discussion.lastReadPostNumber() || 0) + 1);

    /* Setting post counts & text */
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
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10___default().controls(discussion, this).toArray().length ? m((flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_9___default()), {
      icon: "fas fa-ellipsis-v",
      className: "DiscussionListItem-controls",
      buttonClassName: "Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right"
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_10___default().controls(discussion, this).toArray()) : "", m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11___default()), {
      href: app.route.discussion(discussion, jumpTo),
      className: "cardLink"
    }, Number(settings.showBadges) === 1 ? (0,_utils_craftBadges__WEBPACK_IMPORTED_MODULE_4__["default"])(discussion.badges().toArray()) : "", m("div", {
      className: "cardGrid"
    }, m("div", {
      className: "rowSpan-3 colSpan"
    }, m("div", attrs, (isViewsSet || isViewCountSet) && Number(settings.showViews) === 1 && !isNaN(viewsCount) && m("div", {
      className: "imageLabel discussionViews"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default()("fas fa-eye", {
      className: "labelIcon"
    }), viewsCount), media, Number(settings.showAuthor) === 1 && m("div", {
      className: "cardFoot"
    }, m("div", {
      className: "Author"
    }, flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8___default()(discussion.user()), " "), m("div", {
      className: "Date"
    }, flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_6___default()(discussion.createdAt()))))), m("div", {
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
    }, (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__.truncate)(discussion.title(), 80)) : (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__.truncate)(discussion.title(), 80)), app.screen() !== "phone" && Number(settings.showReplies) === 1 && Number(settings.showRepliesOnRight) === 1 && m("div", {
      className: "DiscussionListItem-count"
    }, m("span", {
      "aria-hidden": "true"
    }, flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_14___default()(postCount)), m("span", {
      className: "visually-hidden"
    }, app.translator.trans("core.forum.discussion_list.unread_replies_a11y_label", {
      count: discussion.replyCount()
    })))), m("div", {
      className: "cardTags"
    }, (0,_utils_craftTags__WEBPACK_IMPORTED_MODULE_5__["default"])(discussion.tags()))), Number(settings.previewText) === 1 && discussion.firstPost() && m("div", {
      className: "previewPost"
    }, (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_12__.truncate)(discussion.firstPost().contentPlain(), 150)), Number(settings.showLastPostInfo) === 1 && discussion.firstPost() && m("div", {
      className: "terminalPost"
    }, m((flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_15___default()), {
      discussion: discussion,
      lastPost: discussion.lastPostNumber()
    })), app.screen() === "phone" && Number(settings.showReplies) === 1 ? m("div", {
      className: "cardSpacer"
    }, m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11___default()), {
      className: "Replies",
      href: app.route.discussion(discussion, discussion.lastPostNumber())
    }, m("div", {
      className: "Left"
    }, m("div", {
      className: "Avatars"
    }, m(_LastReplies__WEBPACK_IMPORTED_MODULE_13__["default"], {
      discussion: discussion
    })), m("div", {
      className: "Repcount"
    }, replyText)), m("div", {
      className: "Arrow"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default()("fas fa-angle-right")))) : Number(settings.showReplies) === 1 && !Number(settings.showRepliesOnRight) && m("div", {
      className: "imageLabel discussionReplyCount"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_7___default()("fas fa-comment", {
      className: "labelIcon"
    }), postCount)))));
  };
  return ListItem;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_3___default()));


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

/***/ "./src/forum/helpers/resolveCardImage.js":
/*!***********************************************!*\
  !*** ./src/forum/helpers/resolveCardImage.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ resolveCardImage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Gets the card image url
 */
function resolveCardImage(_x) {
  return _resolveCardImage.apply(this, arguments);
}
function _resolveCardImage() {
  _resolveCardImage = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])(/*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(discussion) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", discussion.attribute('cardImageUrl') || null);
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _resolveCardImage.apply(this, arguments);
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

/***/ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"]);
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/***/ ((module) => {

function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! ../helpers/regeneratorRuntime */ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}


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