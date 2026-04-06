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
/* harmony import */ var _components_common_DiscussionMedia__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/common/DiscussionMedia */ "./src/forum/components/common/DiscussionMedia.js");
/* harmony import */ var _components_common_DiscussionPreview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/common/DiscussionPreview */ "./src/forum/components/common/DiscussionPreview.js");
/* harmony import */ var _components_common_DiscussionReplies__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/common/DiscussionReplies */ "./src/forum/components/common/DiscussionReplies.js");
/* harmony import */ var _components_common_DiscussionBadges__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/common/DiscussionBadges */ "./src/forum/components/common/DiscussionBadges.js");
/* harmony import */ var _components_common_DiscussionLastPost__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/common/DiscussionLastPost */ "./src/forum/components/common/DiscussionLastPost.js");
/* harmony import */ var _utils_craftTags__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/craftTags */ "./src/forum/utils/craftTags.js");
/* harmony import */ var _utils_craftBadges__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/craftBadges */ "./src/forum/utils/craftBadges.js");









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  // Main components
  'walsgit/discussion/cards/components/CardItem': _components_CardItem__WEBPACK_IMPORTED_MODULE_0__["default"],
  'walsgit/discussion/cards/components/ListItem': _components_ListItem__WEBPACK_IMPORTED_MODULE_1__["default"],
  // Reusable subcomponents
  'walsgit/discussion/cards/components/common/DiscussionMedia': _components_common_DiscussionMedia__WEBPACK_IMPORTED_MODULE_2__["default"],
  'walsgit/discussion/cards/components/common/DiscussionPreview': _components_common_DiscussionPreview__WEBPACK_IMPORTED_MODULE_3__["default"],
  'walsgit/discussion/cards/components/common/DiscussionReplies': _components_common_DiscussionReplies__WEBPACK_IMPORTED_MODULE_4__["default"],
  'walsgit/discussion/cards/components/common/DiscussionBadges': _components_common_DiscussionBadges__WEBPACK_IMPORTED_MODULE_5__["default"],
  'walsgit/discussion/cards/components/common/DiscussionLastPost': _components_common_DiscussionLastPost__WEBPACK_IMPORTED_MODULE_6__["default"],
  // Utilities
  'walsgit/discussion/cards/utils/craftTags': _utils_craftTags__WEBPACK_IMPORTED_MODULE_7__["default"],
  'walsgit/discussion/cards/utils/craftBadges': _utils_craftBadges__WEBPACK_IMPORTED_MODULE_8__["default"]
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
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _common_BaseItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/BaseItem */ "./src/forum/components/common/BaseItem.js");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/utils/DiscussionControls */ "flarum/forum/utils/DiscussionControls");
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_DiscussionMedia__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/DiscussionMedia */ "./src/forum/components/common/DiscussionMedia.js");
/* harmony import */ var _common_DiscussionTitle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common/DiscussionTitle */ "./src/forum/components/common/DiscussionTitle.js");
/* harmony import */ var _common_DiscussionBadges__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common/DiscussionBadges */ "./src/forum/components/common/DiscussionBadges.js");
/* harmony import */ var _common_DiscussionTags__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./common/DiscussionTags */ "./src/forum/components/common/DiscussionTags.js");
/* harmony import */ var _common_DiscussionReplies__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./common/DiscussionReplies */ "./src/forum/components/common/DiscussionReplies.js");
/* harmony import */ var _common_DiscussionPreview__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./common/DiscussionPreview */ "./src/forum/components/common/DiscussionPreview.js");











var CardItem = /*#__PURE__*/function (_BaseItem) {
  function CardItem() {
    return _BaseItem.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(CardItem, _BaseItem);
  var _proto = CardItem.prototype;
  _proto.view = function view() {
    var discussion = this.discussion;
    var settings = this.settings;
    var jumpTo = this.getJumpTo();
    return m("div", {
      key: discussion.id(),
      "data-id": discussion.id(),
      className: this.getItemClasses("CardsListItem Card")
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3___default().controls(discussion, this).toArray().length ? m((flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_2___default()), {
      icon: "fas fa-ellipsis-v",
      className: "DiscussionListItem-controls",
      buttonClassName: "Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right"
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3___default().controls(discussion, this).toArray()) : "", m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4___default()), {
      href: app.route.discussion(discussion, jumpTo),
      className: "cardLink"
    }, m(_common_DiscussionBadges__WEBPACK_IMPORTED_MODULE_7__["default"], {
      discussion: discussion,
      settings: settings
    }), m(_common_DiscussionMedia__WEBPACK_IMPORTED_MODULE_5__["default"], {
      discussion: discussion,
      settings: settings
    }), m(_common_DiscussionTags__WEBPACK_IMPORTED_MODULE_8__["default"], {
      discussion: discussion
    }), m("div", {
      className: "cardTitle"
    }, m(_common_DiscussionTitle__WEBPACK_IMPORTED_MODULE_6__["default"], {
      discussion: discussion,
      settings: settings
    })), m(_common_DiscussionPreview__WEBPACK_IMPORTED_MODULE_10__["default"], {
      discussion: discussion,
      settings: settings
    }), m(_common_DiscussionReplies__WEBPACK_IMPORTED_MODULE_9__["default"], {
      discussion: discussion,
      settings: settings,
      layout: "card"
    })));
  };
  return CardItem;
}(_common_BaseItem__WEBPACK_IMPORTED_MODULE_1__["default"]);


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
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _common_BaseItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/BaseItem */ "./src/forum/components/common/BaseItem.js");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/utils/DiscussionControls */ "flarum/forum/utils/DiscussionControls");
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_DiscussionMedia__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/DiscussionMedia */ "./src/forum/components/common/DiscussionMedia.js");
/* harmony import */ var _common_DiscussionTitle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common/DiscussionTitle */ "./src/forum/components/common/DiscussionTitle.js");
/* harmony import */ var _common_DiscussionBadges__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common/DiscussionBadges */ "./src/forum/components/common/DiscussionBadges.js");
/* harmony import */ var _common_DiscussionTags__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./common/DiscussionTags */ "./src/forum/components/common/DiscussionTags.js");
/* harmony import */ var _common_DiscussionReplies__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./common/DiscussionReplies */ "./src/forum/components/common/DiscussionReplies.js");
/* harmony import */ var _common_DiscussionLastPost__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./common/DiscussionLastPost */ "./src/forum/components/common/DiscussionLastPost.js");
/* harmony import */ var _common_DiscussionPreview__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./common/DiscussionPreview */ "./src/forum/components/common/DiscussionPreview.js");












var ListItem = /*#__PURE__*/function (_BaseItem) {
  function ListItem() {
    return _BaseItem.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ListItem, _BaseItem);
  var _proto = ListItem.prototype;
  _proto.view = function view() {
    var discussion = this.discussion;
    var settings = this.settings;
    var jumpTo = this.getJumpTo();
    return m("div", {
      key: discussion.id(),
      "data-id": discussion.id(),
      className: this.getItemClasses("CardsListItem List")
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3___default().controls(discussion, this).toArray().length ? m((flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_2___default()), {
      icon: "fas fa-ellipsis-v",
      className: "DiscussionListItem-controls",
      buttonClassName: "Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right"
    }, flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_3___default().controls(discussion, this).toArray()) : "", m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_4___default()), {
      href: app.route.discussion(discussion, jumpTo),
      className: "cardLink"
    }, m(_common_DiscussionBadges__WEBPACK_IMPORTED_MODULE_7__["default"], {
      discussion: discussion,
      settings: settings
    }), m("div", {
      className: "cardGrid"
    }, m("div", {
      className: "rowSpan-3 colSpan"
    }, m(_common_DiscussionMedia__WEBPACK_IMPORTED_MODULE_5__["default"], {
      discussion: discussion,
      settings: settings
    })), m("div", {
      className: "rowSpan-3 colSpan-2"
    }, m("div", {
      className: "flexBox"
    }, m("div", {
      className: "cardTitle"
    }, m(_common_DiscussionTitle__WEBPACK_IMPORTED_MODULE_6__["default"], {
      discussion: discussion,
      settings: settings
    }), app.screen() !== "phone" && Number(settings.showRepliesOnRight) === 1 && m(_common_DiscussionReplies__WEBPACK_IMPORTED_MODULE_9__["default"], {
      discussion: discussion,
      settings: settings,
      layout: "list"
    })), m(_common_DiscussionTags__WEBPACK_IMPORTED_MODULE_8__["default"], {
      discussion: discussion
    })), m(_common_DiscussionPreview__WEBPACK_IMPORTED_MODULE_11__["default"], {
      discussion: discussion,
      settings: settings
    }), app.screen() !== "phone" ? m(_common_DiscussionLastPost__WEBPACK_IMPORTED_MODULE_10__["default"], {
      discussion: discussion,
      settings: settings,
      layout: "list"
    }) : "", app.screen() === "phone" ? m(_common_DiscussionReplies__WEBPACK_IMPORTED_MODULE_9__["default"], {
      discussion: discussion,
      settings: settings,
      layout: "mobile"
    }) : !Number(settings.showRepliesOnRight) && m(_common_DiscussionReplies__WEBPACK_IMPORTED_MODULE_9__["default"], {
      discussion: discussion,
      settings: settings,
      layout: "fallback"
    })))));
  };
  return ListItem;
}(_common_BaseItem__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ }),

/***/ "./src/forum/components/common/BaseItem.js":
/*!*************************************************!*\
  !*** ./src/forum/components/common/BaseItem.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BaseItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helpers_getDiscussionSettings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/getDiscussionSettings */ "./src/forum/helpers/getDiscussionSettings.js");

/*
* Base component for CardItem.js & ListItem.js
*/


var BaseItem = /*#__PURE__*/function (_Component) {
  function BaseItem() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(BaseItem, _Component);
  var _proto = BaseItem.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.discussion = this.attrs.discussion;
    this.settings = (0,_helpers_getDiscussionSettings__WEBPACK_IMPORTED_MODULE_2__.getDiscussionSettings)();
  }

  /* Sets which post to jump to when clicking on a card: first unread or last post. */;
  _proto.getJumpTo = function getJumpTo() {
    var _d$lastPostNumber;
    var d = this.discussion;
    return Math.min((_d$lastPostNumber = d.lastPostNumber()) != null ? _d$lastPostNumber : 0, (d.lastReadPostNumber() || 0) + 1);
  }

  /* Optional: sets to show if card should be marked as read or unread. */;
  _proto.isRead = function isRead() {
    return Number(this.settings.markReadCards) === 1 && this.discussion.isRead() && app.session.user;
  }

  /* construct card classes. */;
  _proto.getItemClasses = function getItemClasses(base) {
    if (base === void 0) {
      base = "";
    }
    return [base, this.isRead() ? "read" : "", this.discussion.isHidden() ? "Hidden" : ""].filter(Boolean).join(" ");
  };
  return BaseItem;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/common/DiscussionBadges.js":
/*!*********************************************************!*\
  !*** ./src/forum/components/common/DiscussionBadges.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DiscussionBadges)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_craftBadges__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/craftBadges */ "./src/forum/utils/craftBadges.js");

/*
* Component that displays badges on discussion cards (optional)
*/


var DiscussionBadges = /*#__PURE__*/function (_Component) {
  function DiscussionBadges() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DiscussionBadges, _Component);
  var _proto = DiscussionBadges.prototype;
  _proto.view = function view(vnode) {
    var _this$attrs = this.attrs,
      discussion = _this$attrs.discussion,
      settings = _this$attrs.settings;
    if (Number(settings.showBadges) !== 1) return null;
    return (0,_utils_craftBadges__WEBPACK_IMPORTED_MODULE_2__["default"])(discussion.badges().toArray());
  };
  return DiscussionBadges;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/common/DiscussionLastPost.js":
/*!***********************************************************!*\
  !*** ./src/forum/components/common/DiscussionLastPost.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DiscussionLastPost)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/TerminalPost */ "flarum/components/TerminalPost");
/* harmony import */ var flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_2__);

/*
* Component that displays the last post info on discussion cards (optional)
* Uses the TerminalPost component from Flarum
*/


var DiscussionLastPost = /*#__PURE__*/function (_Component) {
  function DiscussionLastPost() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DiscussionLastPost, _Component);
  var _proto = DiscussionLastPost.prototype;
  _proto.view = function view(vnode) {
    var _this$attrs = this.attrs,
      discussion = _this$attrs.discussion,
      settings = _this$attrs.settings,
      layout = _this$attrs.layout;
    if (Number(settings.showLastPostInfo) !== 1) return null;
    if (layout === "card") {
      return m("div", {
        className: "terminalPost"
      }, m((flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_2___default()), {
        discussion: discussion,
        lastPost: discussion.lastPostNumber()
      }));
    }
    if (layout === "list") {
      return m("div", {
        className: "terminalPost"
      }, m((flarum_components_TerminalPost__WEBPACK_IMPORTED_MODULE_2___default()), {
        discussion: discussion,
        lastPost: discussion.lastPostNumber()
      }));
    }
    return null;
  };
  return DiscussionLastPost;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/common/DiscussionMedia.js":
/*!********************************************************!*\
  !*** ./src/forum/components/common/DiscussionMedia.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DiscussionMedia)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/humanTime */ "flarum/common/utils/humanTime");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/helpers/username */ "flarum/common/helpers/username");
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_4__);

/*
* Component that displays the card image of the discussion cards
*/




var DiscussionMedia = /*#__PURE__*/function (_Component) {
  function DiscussionMedia() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DiscussionMedia, _Component);
  var _proto = DiscussionMedia.prototype;
  _proto.view = function view(vnode) {
    var _this$attrs = this.attrs,
      discussion = _this$attrs.discussion,
      settings = _this$attrs.settings;
    var imageUrl = discussion.attribute("cardImageUrl") || null;

    // optional data to show on top of image
    var attrs = {
      className: "wrapImg" + (Number(settings.showAuthor) === 1 ? " After" : "")
    };

    // 3rd party "views" extensions support
    var viewsActivated = "fof-discussion-views" in flarum.extensions;
    var isViewsSet = discussion.data.attributes.hasOwnProperty("views");
    var mbViewsActivated = "michaelbelgium-discussion-views" in flarum.extensions;
    var isViewCountSet = discussion.data.attributes.hasOwnProperty("viewCount");
    var viewsCount = viewsActivated && isViewsSet ? discussion.views() : mbViewsActivated && isViewCountSet ? discussion.viewCount() : NaN;
    return m("div", attrs, (isViewsSet || isViewCountSet) && Number(settings.showViews) === 1 && !isNaN(viewsCount) && m("div", {
      className: "imageLabel discussionViews"
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_4___default()("fas fa-eye", {
      className: "labelIcon"
    }), viewsCount), imageUrl ? m("img", {
      src: imageUrl,
      className: "previewCardImg",
      alt: discussion.title(),
      loading: "lazy"
    }) :
    // fallback to Discussion Cards' extension default image
    m("div", {
      className: "imgStub"
    }), Number(settings.showAuthor) === 1 && m("div", {
      className: "cardFoot"
    }, m("div", {
      className: "Author"
    }, flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_3___default()(discussion.user())), m("div", {
      className: "Date"
    }, flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_2___default()(discussion.createdAt()))));
  };
  return DiscussionMedia;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/common/DiscussionPreview.js":
/*!**********************************************************!*\
  !*** ./src/forum/components/common/DiscussionPreview.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DiscussionPreview)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/string */ "flarum/common/utils/string");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_2__);

/*
* Component that displays the preview text of the first post on discussion cards (optional)
*/


var DiscussionPreview = /*#__PURE__*/function (_Component) {
  function DiscussionPreview() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DiscussionPreview, _Component);
  var _proto = DiscussionPreview.prototype;
  _proto.view = function view(vnode) {
    var _this$attrs = this.attrs,
      discussion = _this$attrs.discussion,
      settings = _this$attrs.settings,
      _this$attrs$maxLength = _this$attrs.maxLength,
      maxLength = _this$attrs$maxLength === void 0 ? 150 : _this$attrs$maxLength;
    if (Number(settings.previewText) !== 1) return null;
    if (!discussion.firstPost || typeof discussion.firstPost !== 'function' || !discussion.firstPost()) return null;
    return m("div", {
      className: "previewPost"
    }, (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_2__.truncate)(discussion.firstPost().contentPlain(), maxLength));
  };
  return DiscussionPreview;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/common/DiscussionReplies.js":
/*!**********************************************************!*\
  !*** ./src/forum/components/common/DiscussionReplies.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DiscussionReplies)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_craftRepliesAvatars__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/craftRepliesAvatars */ "./src/forum/utils/craftRepliesAvatars.js");
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/abbreviateNumber */ "flarum/common/utils/abbreviateNumber");
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _DiscussionLastPost__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DiscussionLastPost */ "./src/forum/components/common/DiscussionLastPost.js");

/*
* Component that displays the number of replies on discussion cards (optional)
*/






var DiscussionReplies = /*#__PURE__*/function (_Component) {
  function DiscussionReplies() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DiscussionReplies, _Component);
  var _proto = DiscussionReplies.prototype;
  _proto.view = function view(vnode) {
    var _this$attrs = this.attrs,
      discussion = _this$attrs.discussion,
      settings = _this$attrs.settings,
      layout = _this$attrs.layout;
    if (Number(settings.showReplies) !== 1) return null;
    var replyText = discussion.unreadCount() ? app.translator.trans("walsgit_discussion_cards.forum.unreadReplies", {
      count: discussion.unreadCount()
    }) : app.translator.trans("walsgit_discussion_cards.forum.replies", {
      count: discussion.replyCount() || "0"
    });
    var postCount = discussion.unreadCount() ? discussion.unreadCount() : discussion.replyCount();

    // For Primary Cards layout (shows avatars & number of unread replies or total replies) and list cards layout on mobile
    if (layout === "card" || layout === "mobile") {
      return m("div", {
        className: "cardSpacer"
      }, m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_2___default()), {
        className: "Replies",
        href: app.route.discussion(discussion, discussion.lastPostNumber())
      }, m("div", {
        className: "Left"
      }, m("div", {
        className: "Avatars"
      }, (0,_utils_craftRepliesAvatars__WEBPACK_IMPORTED_MODULE_4__["default"])(discussion)), m("div", {
        className: "Repcount"
      }, replyText)), m("div", {
        className: "Right"
      }, m(_DiscussionLastPost__WEBPACK_IMPORTED_MODULE_6__["default"], {
        discussion: discussion,
        settings: settings,
        layout: "card"
      }), m("div", {
        className: "Arrow"
      }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default()("fas fa-angle-right")))));
    }

    // For List cards layout (icon via css + number on the right)
    if (layout === "list") {
      return m("div", {
        className: "DiscussionListItem-count"
      }, m("span", {
        "aria-hidden": "true"
      }, flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_5___default()(postCount)), m("span", {
        className: "visually-hidden"
      }, app.translator.trans("core.forum.discussion_list.unread_replies_a11y_label", {
        count: discussion.replyCount()
      })));
    }

    // List cards responsive fallback when screen size is reduced to mobile or less (icon + number on the right)
    if (layout === "fallback") {
      return m("div", {
        className: "imageLabel discussionReplyCount"
      }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default()("fas fa-comment", {
        className: "labelIcon"
      }), postCount);
    }
    return null;
  };
  return DiscussionReplies;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/common/DiscussionTags.js":
/*!*******************************************************!*\
  !*** ./src/forum/components/common/DiscussionTags.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DiscussionTags)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_craftTags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/craftTags */ "./src/forum/utils/craftTags.js");

/*
* Component that displays Tags on discussion cards (optional)
*/


var DiscussionTags = /*#__PURE__*/function (_Component) {
  function DiscussionTags() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DiscussionTags, _Component);
  var _proto = DiscussionTags.prototype;
  _proto.view = function view(vnode) {
    var discussion = this.attrs.discussion;
    return m("div", {
      className: "cardTags"
    }, (0,_utils_craftTags__WEBPACK_IMPORTED_MODULE_2__["default"])(discussion.tags()));
  };
  return DiscussionTags;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/common/DiscussionTitle.js":
/*!********************************************************!*\
  !*** ./src/forum/components/common/DiscussionTitle.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DiscussionTitle)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/string */ "flarum/common/utils/string");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_2__);

/*
* Component that displays the discussion title on discussion cards
*/


var DiscussionTitle = /*#__PURE__*/function (_Component) {
  function DiscussionTitle() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DiscussionTitle, _Component);
  var _proto = DiscussionTitle.prototype;
  _proto.view = function view(vnode) {
    var _this$attrs = this.attrs,
      discussion = _this$attrs.discussion,
      settings = _this$attrs.settings;

    // Optional: support for 3rg party extension Repost
    var repostActivated = "shebaoting-repost" in flarum.extensions;
    var repostUrl = discussion.data.attributes.original_url || null;

    // Title max length (default: 80)
    var maxLength = 80;
    return m("h2", {
      title: discussion.title(),
      className: "title"
    }, Number(settings.allowRepostLinks) === 1 && repostActivated && repostUrl ? m("a", {
      href: repostUrl,
      onclick: function onclick(e) {
        return e.stopPropagation();
      }
    }, (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_2__.truncate)(discussion.title(), maxLength)) : (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_2__.truncate)(discussion.title(), maxLength));
  };
  return DiscussionTitle;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/helpers/checkOverflowingContent.js":
/*!******************************************************!*\
  !*** ./src/forum/helpers/checkOverflowingContent.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ checkOverflowingContent)
/* harmony export */ });
/*
* Checks overflowing content on cards like long list of Tags or long titles and makes them scroll on hover
*/
function checkOverflowingContent() {
  var cardListItemsOnPrimary = document.querySelectorAll(".CardsListItem.Card .cardLink");
  var cardListItems = document.querySelectorAll(".cardGrid .colSpan-2");
  var toggleOverflowClass = function toggleOverflowClass(cardTags, cardListItem) {
    if (!cardTags) return;

    // -30 to account for the 15px + 15px margins on .cardTags
    if (cardTags.scrollWidth > cardListItem.clientWidth - 30) {
      cardTags.classList.add("overflowing");
    } else {
      cardTags.classList.remove("overflowing");
    }
  };

  // Tags on Primary cards
  cardListItemsOnPrimary.forEach(function (cardListItem) {
    var cardTags = cardListItem.querySelector(".cardTags");
    toggleOverflowClass(cardTags, cardListItem);
  });

  // Tags & Titles list cards
  cardListItems.forEach(function (cardListItem) {
    var cardTags = cardListItem.querySelector(".flexBox .cardTags");
    toggleOverflowClass(cardTags, cardListItem);
    var cardTitle = cardListItem.querySelector(".cardTitle h2.title");
    if (!cardTitle) return;

    // only on tablet & desktop screens for title
    if (app.screen() !== "phone" && cardTitle.scrollWidth > cardTitle.clientWidth) {
      cardTitle.classList.add("overflowing");
    } else {
      cardTitle.classList.remove("overflowing");
    }
  });
}

/***/ }),

/***/ "./src/forum/helpers/getDiscussionSettings.js":
/*!****************************************************!*\
  !*** ./src/forum/helpers/getDiscussionSettings.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDiscussionSettings: () => (/* binding */ getDiscussionSettings)
/* harmony export */ });
/**
 * Gets the Discussion Cards' settings
 */
function getDiscussionSettings() {
  var settings = {};
  for (var key in app.forum.data.attributes) {
    if (key.startsWith("walsgitDiscussionCards")) {
      var newKey = key.replace("walsgitDiscussionCards", "");
      newKey = newKey.replace(/^./, newKey.charAt(0).toLowerCase());
      settings[newKey] = app.forum.data.attributes[key];
    }
  }
  return settings;
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
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/DiscussionListItem */ "flarum/forum/components/DiscussionListItem");
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3__);
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
/* harmony import */ var _helpers_checkOverflowingContent__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./helpers/checkOverflowingContent */ "./src/forum/helpers/checkOverflowingContent.js");
/* harmony import */ var flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/models/Post */ "flarum/common/models/Post");
/* harmony import */ var flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! flarum/common/models/Discussion */ "flarum/common/models/Discussion");
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _compat__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./compat */ "./src/forum/compat.js");
/* harmony import */ var _flarum_core_forum__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @flarum/core/forum */ "@flarum/core/forum");
/* harmony import */ var _flarum_core_forum__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_flarum_core_forum__WEBPACK_IMPORTED_MODULE_14__);













flarum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('walsgit/discussion/cards', function () {
  (0,flarum_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oncreate', _helpers_checkOverflowingContent__WEBPACK_IMPORTED_MODULE_10__["default"]);
  (0,flarum_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'onupdate', _helpers_checkOverflowingContent__WEBPACK_IMPORTED_MODULE_10__["default"]);
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
      var useListCards = Number(settings.useListCards) === 1;
      var listCardsCount = Number(settings.listCardsCount);
      return m("div", {
        className: 'DiscussionList' + (state.isSearchResults() ? ' DiscussionList--searchResults' : '')
      }, m("div", {
        "class": "DiscussionList-discussions flexCard"
      }, state.getPages().map(function (pg, o) {
        return pg.items.filter(function (d, i) {
          return o === 0 && i < Number(settings.primaryCards);
        }).map(function (discussion) {
          return m(_components_CardItem__WEBPACK_IMPORTED_MODULE_8__["default"], {
            discussion: discussion
          });
        });
      })), m("div", {
        "class": "DiscussionList-discussions"
      }, state.getPages().map(function (pg, o) {
        // Skip primary cards
        var secondaryItems = pg.items.filter(function (d, i) {
          return !(o === 0 && i < Number(settings.primaryCards));
        });
        return secondaryItems.map(function (discussion, idx) {
          var _app$search$params, _app$search;
          // Only if useListCards === 1 && (idx < listCardsCount OR listCardsCount = 0)
          var showCard = useListCards && (listCardsCount === 0 || idx < listCardsCount);
          return showCard ? m(_components_ListItem__WEBPACK_IMPORTED_MODULE_9__["default"], {
            discussion: discussion
          }) : m((flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_3___default()), {
            discussion: discussion,
            params: (_app$search$params = (_app$search = (flarum_app__WEBPACK_IMPORTED_MODULE_0___default().search)) == null ? void 0 : _app$search.params()) != null ? _app$search$params : {}
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

/**
 * Refresh card image after first post edition
 */
(0,flarum_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_11___default().prototype), 'save', function (promise) {
  promise.then(function (updatedPost) {
    // first post only
    if (updatedPost.number() !== 1) {
      return;
    }

    /** @type {Discussion} */
    var discussion = updatedPost.discussion();
    if (discussion && discussion.id()) {
      flarum_app__WEBPACK_IMPORTED_MODULE_0___default().store.find('discussions', discussion.id(), {}).then(function (newDiscussionModel) {
        var newImageUrl = newDiscussionModel.attribute('cardImageUrl');
        if (newImageUrl) {
          discussion.pushAttributes({
            'cardImageUrl': newImageUrl
          });
          m.redraw();
        }
      })["catch"](function (error) {
        console.error(flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("walsgit_discussion_cards.forum.console.postUpdateCardImageError"), error);
      });
    }
  });
}, 100);

// Expose compat API


Object.assign(_flarum_core_forum__WEBPACK_IMPORTED_MODULE_14__.compat, _compat__WEBPACK_IMPORTED_MODULE_13__["default"]);

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

/***/ "./src/forum/utils/craftRepliesAvatars.js":
/*!************************************************!*\
  !*** ./src/forum/utils/craftRepliesAvatars.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ craftRepliesAvatars)
/* harmony export */ });
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/helpers/avatar */ "flarum/common/helpers/avatar");
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Crafts avatars of some participants of the discussion (used in primary cards)
 * @param {Discussion} discussion
 * @returns {Mithril.Children}
 */


function craftRepliesAvatars(discussion) {
  var participants = [];

  // Always add the discussion starter
  var starter = discussion.user && discussion.user();
  if (!starter) {
    return null;
  }
  participants.push(starter);

  // Then add the last poster if they're different from the starter
  var lastPoster = discussion.lastPostedUser && discussion.lastPostedUser();
  if (lastPoster && lastPoster.id() !== starter.id()) {
    participants.push(lastPoster);
  }

  // Limit to 2 participants maximum (starter + last poster)
  var finalParticipants = participants.slice(0, 2);
  return finalParticipants.map(function (user) {
    return m('[', null, flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_0___default()(user, {
      className: 'Avatar--mini'
    }));
  });
}

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
      }, tag.icon() ? m("i", {
        className: 'TagLabel-icon icon ' + tag.icon(),
        "aria-hidden": "true"
      }) : "", tag.name())];
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

/***/ "flarum/common/models/Discussion":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/models/Discussion']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/models/Discussion'];

/***/ }),

/***/ "flarum/common/models/Post":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/models/Post']" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/models/Post'];

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

/***/ "flarum/forum/components/DiscussionListItem":
/*!****************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionListItem']" ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/DiscussionListItem'];

/***/ }),

/***/ "flarum/forum/components/IndexPage":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/IndexPage']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/IndexPage'];

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