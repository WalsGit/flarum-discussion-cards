/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/components/Settings.js":
/*!******************************************!*\
  !*** ./src/admin/components/Settings.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/admin/components/ExtensionPage */ "flarum/admin/components/ExtensionPage");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/admin/components/UploadImageButton */ "flarum/admin/components/UploadImageButton");
/* harmony import */ var flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _helpers_isExtensionInstalled__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/isExtensionInstalled */ "./src/admin/helpers/isExtensionInstalled.js");
/* harmony import */ var _helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/isExtensionActive */ "./src/admin/helpers/isExtensionActive.js");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6__);







var Settings = /*#__PURE__*/function (_ExtensionPage) {
  function Settings() {
    return _ExtensionPage.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Settings, _ExtensionPage);
  var _proto = Settings.prototype;
  _proto.content = function content() {
    /* Supported third party extensions' info */
    var viewsExtension = {
      id: 'flarumite-simple-discussion-views',
      name: 'Flarumite Simple Discussion Views',
      url: 'https://flarum.org/extension/flarumite/simple-discussion-views'
    };
    var mbViewsExtension = {
      id: 'michaelbelgium-discussion-views',
      name: 'michaelbelgium/flarum-discussion-views',
      url: 'https://flarum.org/extension/michaelbelgium/flarum-discussion-views'
    };
    var blogExtension = {
      id: 'v17development-blog',
      name: 'Flarum Blog',
      url: 'https://flarum.org/extension/v17development/flarum-blog'
    };
    var repostExtension = {
      id: 'shebaoting-repost',
      name: 'Repost',
      url: 'https://flarum.org/extension/shebaoting/repost'
    };
    var warningIcon = flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_6___default()("fas fa-exclamation-triangle");
    return m("div", {
      className: "DiscussionCardsSettings"
    }, m("div", {
      className: "container"
    }, m("div", {
      className: "DiscussionCardsSettings--content"
    }, m("h3", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.where_title")), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.where_info")), m("div", {
      className: "Section"
    }, this.buildSettingComponent({
      type: "flarum-tags.select-tags",
      setting: "walsgit_discussion_cards_allowedTags",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.allowedTags_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.allowedTags_help"),
      options: {
        requireParentTag: false
      }
    }), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_onIndexPage",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.onIndexPage_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.onIndexPage_help")
    })), m("h3", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.primaryCardOptions_title")), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.primaryCardOptions_info")), m("div", {
      className: "Section"
    }, this.buildSettingComponent({
      type: "number",
      className: 'DC-Number',
      setting: "walsgit_discussion_cards_primaryCards",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.primaryCards_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.primaryCards_help"),
      min: 0,
      step: 1,
      placeholder: 4
    }), this.buildSettingComponent({
      type: "number",
      className: 'DC-Number',
      setting: "walsgit_discussion_cards_desktopCardWidth",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.desktopCardWidth_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.desktopCardWidth_help"),
      min: 10,
      max: 100,
      step: 1,
      placeholder: 49
    }), this.buildSettingComponent({
      type: "number",
      className: 'DC-Number',
      setting: "walsgit_discussion_cards_tabletCardWidth",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.tabletCardWidth_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.tabletCardWidth_help"),
      min: 10,
      max: 100,
      step: 1,
      placeholder: 49
    })), m("h3", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.cardOptions_title")), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.cardOptions_info")), m("div", {
      className: "Section"
    }, m("div", {
      className: "DC-DefaultImageSettings"
    }, m("h4", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.defaultImage_title")), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.defaultImage_info")), flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute("walsgitDiscussionCardsDefaultImage") === null ? m("div", {
      className: "imgStub"
    }) : m("img", {
      className: "DC-UserUploadedImage",
      src: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute("baseUrl") + "/assets/" + flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute("walsgitDiscussionCardsDefaultImage")
    }), m((flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_3___default()), {
      name: "walsgit_discussion_cards_default_image",
      "class": "DC-UploadImageBtn"
    })), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_previewText",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.previewText_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.previewText_help")
    }), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_showAuthor",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showAuthor_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showAuthor_help")
    }), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_showReplies",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showReplies_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showReplies_help")
    }), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_showRepliesOnRight",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showRepliesOnRight_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showRepliesOnRight_help")
    }), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_showLastPostInfo",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showLastPostInfo_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showLastPostInfo_help")
    }), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_showBadges",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showBadges_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showBadges_help")
    }), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_markReadCards",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.markReadCards_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.markReadCards_help")
    })), m("h3", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.otherOptions_title")), m("p", {
      className: "helpText"
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.otherOptions_info")), m("div", {
      className: "Section"
    }, m("h4", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_title_start"), m("a", {
      href: viewsExtension.url,
      target: "_blank",
      rel: "noopener noreferrer"
    }, viewsExtension.name), flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_title_or"), m("a", {
      href: mbViewsExtension.url,
      target: "_blank",
      rel: "noopener noreferrer"
    }, mbViewsExtension.name), flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_title_end")), m("div", {
      className: "helpText"
    }, m("em", null, !(0,_helpers_isExtensionInstalled__WEBPACK_IMPORTED_MODULE_4__["default"])(viewsExtension.id) && !(0,_helpers_isExtensionInstalled__WEBPACK_IMPORTED_MODULE_4__["default"])(mbViewsExtension.id) ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.viewsExtension_notInstalled", {
      icon: warningIcon
    }) : (0,_helpers_isExtensionInstalled__WEBPACK_IMPORTED_MODULE_4__["default"])(viewsExtension.id) && !(0,_helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__["default"])(viewsExtension.id) || (0,_helpers_isExtensionInstalled__WEBPACK_IMPORTED_MODULE_4__["default"])(mbViewsExtension.id) && !(0,_helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__["default"])(mbViewsExtension.id) ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.viewsExtension_notActivated", {
      icon: warningIcon
    }) : '')), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_showViews",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.showViews_help"),
      disabled: (0,_helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__["default"])(viewsExtension.id) || (0,_helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__["default"])(mbViewsExtension.id) ? false : true
    }), m("hr", null), m("h4", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.blogExtension_title_start"), m("a", {
      href: blogExtension.url,
      target: "_blank",
      rel: "noopener noreferrer"
    }, blogExtension.name), flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.blogExtension_title_end")), m("div", {
      className: "helpText"
    }, m("em", null, !(0,_helpers_isExtensionInstalled__WEBPACK_IMPORTED_MODULE_4__["default"])(blogExtension.id) ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.blogExtension_notInstalled", {
      icon: warningIcon
    }) : !(0,_helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__["default"])(blogExtension.id) ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.blogExtension_notActivated", {
      icon: warningIcon
    }) : '')), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_useBlogImages",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.useBlogImages_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.useBlogImages_help"),
      disabled: (0,_helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__["default"])(blogExtension.id) ? false : true
    }), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_useBlogSummary",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.useBlogSummary_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.useBlogSummary_help"),
      disabled: (0,_helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__["default"])(blogExtension.id) ? false : true
    }), m("hr", null), m("h4", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.repostExtension_title_start"), m("a", {
      href: repostExtension.url,
      target: "_blank",
      rel: "noopener noreferrer"
    }, repostExtension.name), flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.repostExtension_title_end")), m("div", {
      className: "helpText"
    }, m("em", null, !(0,_helpers_isExtensionInstalled__WEBPACK_IMPORTED_MODULE_4__["default"])(repostExtension.id) ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.repostExtension_notInstalled", {
      icon: warningIcon
    }) : !(0,_helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__["default"])(repostExtension.id) ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.repostExtension_notActivated", {
      icon: warningIcon
    }) : '')), this.buildSettingComponent({
      type: "switch",
      setting: "walsgit_discussion_cards_allowRepostLinks",
      label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.allowRepostLinks_label"),
      help: flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("walsgit_discussion_cards.admin.settings.general.allowRepostLinks_help"),
      disabled: (0,_helpers_isExtensionActive__WEBPACK_IMPORTED_MODULE_5__["default"])(repostExtension.id) ? false : true
    })), this.submitButton())));
  };
  _proto.onsubmit = function onsubmit() {
    var primaryCards = Number(this.setting('walsgit_discussion_cards_primaryCards')());
    var desktopCardWidth = Number(this.setting('walsgit_discussion_cards_desktopCardWidth')());
    var tabletCardWidth = Number(this.setting('walsgit_discussion_cards_tabletCardWidth')());
    if (primaryCards < 0 || isNaN(primaryCards)) {
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.show({
        type: 'error'
      }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('walsgit_discussion_cards.admin.errors.primaryCards'));
      return false;
    }
    if (desktopCardWidth < 10 || desktopCardWidth > 100 || isNaN(desktopCardWidth)) {
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.show({
        type: 'error'
      }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('walsgit_discussion_cards.admin.errors.desktopCardWidth'));
      return false;
    }
    if (tabletCardWidth < 10 || tabletCardWidth > 100 || isNaN(tabletCardWidth)) {
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().alerts.show({
        type: 'error'
      }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('walsgit_discussion_cards.admin.errors.tabletCardWidth'));
      return false;
    }
    return true;
  };
  _proto.saveSettings = function saveSettings(e) {
    if (!this.onsubmit()) {
      return;
    }
    var settings = this.dirty();
    _ExtensionPage.prototype.saveSettings.call(this, e).then(function () {
      var newSettings = {};
      for (var key in settings) {
        var endOfKey = key.replace('walsgit_discussion_cards_', '');
        endOfKey = endOfKey.replace(/^./, endOfKey.charAt(0).toUpperCase());
        var newKey = 'walsgitDiscussionCards' + endOfKey;
        newSettings[newKey] = settings[key];
      }
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_1___default().forum.pushAttributes(newSettings);
    })["catch"](function (error) {
      console.error(error);
    });
  };
  return Settings;
}((flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/admin/components/UploadTagImageButton.js":
/*!******************************************************!*\
  !*** ./src/admin/components/UploadTagImageButton.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadTagImageButton)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/tags/components/EditTagModal */ "flarum/tags/components/EditTagModal");
/* harmony import */ var flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_5__);






var UploadTagImageButton = /*#__PURE__*/function (_Button) {
  function UploadTagImageButton(props) {
    var _this;
    _this = _Button.call(this, props) || this;
    _this.loading = false;
    _this.tagId = props.attrs.tagId;
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(UploadTagImageButton, _Button);
  var _proto = UploadTagImageButton.prototype;
  _proto.view = function view(vnode) {
    this.attrs.loading = this.loading;
    this.attrs.className = flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default()(this.attrs.className, "Button");
    if ((flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().store).data.tags[this.tagId].data.attributes.walsgitDiscussionCardsTagDefaultImage) {
      this.attrs.onclick = this.remove.bind(this);
      return m("div", null, m("p", null, m("img", {
        className: "DC-TagDefaultImage",
        src: "assets/" + (flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().store).data.tags[this.tagId].data.attributes.walsgitDiscussionCardsTagDefaultImage,
        alt: "",
        width: "200px"
      })), m("p", null, _Button.prototype.view.call(this, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, vnode, {
        children: flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans("core.admin.upload_image.remove_button")
      }))));
    } else {
      this.attrs.onclick = this.upload.bind(this);
    }
    return _Button.prototype.view.call(this, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, vnode, {
      children: flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans("core.admin.upload_image.upload_button")
    }));
  }

  /**
   * Prompt the user to upload an image.
   */;
  _proto.upload = function upload() {
    var _this2 = this;
    if (this.loading) return;
    var $input = $('<input type="file">');
    $input.appendTo("body").hide().trigger("click").on("change", function (e) {
      var body = new FormData();
      body.append(_this2.attrs.name, $(e.target)[0].files[0]);
      body.append('tagId', _this2.tagId);
      _this2.loading = true;
      m.redraw();
      flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().request({
        method: "POST",
        url: _this2.resourceUrl(),
        serialize: function serialize(raw) {
          return raw;
        },
        body: body
      }).then(_this2.success.bind(_this2), _this2.failure.bind(_this2));
    });
  }

  /**
   * Remove the image.
   */;
  _proto.remove = function remove() {
    this.loading = true;
    m.redraw();
    var body = new FormData();
    body.append('tagId', this.tagId);
    flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().request({
      method: "DELETE",
      url: this.resourceUrl(),
      body: body
    }).then(this.success.bind(this), this.failure.bind(this));
  };
  _proto.resourceUrl = function resourceUrl() {
    return flarum_admin_app__WEBPACK_IMPORTED_MODULE_2___default().forum.attribute("apiUrl") + "/" + this.attrs.name;
  }

  /**
   * After a successful upload/removal, reload the page.
   *
   * @param {object} response
   * @protected
   */;
  _proto.success = function success(response) {
    window.location.reload();
  }

  /**
   * If upload/removal fails, stop loading.
   *
   * @param {object} response
   * @protected
   */;
  _proto.failure = function failure(response) {
    this.loading = false;
    m.redraw();
  };
  return UploadTagImageButton;
}((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()));


/***/ }),

/***/ "./src/admin/components/WdcTagSettingsModal.js":
/*!*****************************************************!*\
  !*** ./src/admin/components/WdcTagSettingsModal.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WdcTagSettingsModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__);




var defaultSettings = {};
var WdcTagSettingsModal = /*#__PURE__*/function (_Modal) {
  function WdcTagSettingsModal() {
    return _Modal.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(WdcTagSettingsModal, _Modal);
  var _proto = WdcTagSettingsModal.prototype;
  _proto.oninit = function oninit(vnode) {
    _Modal.prototype.oninit.call(this, vnode);
    this.tagSettings = JSON.parse(this.attrs.model.data.attributes.walsgitDiscussionCardsTagSettings || null) || {};
    defaultSettings = {
      primaryCards: app.forum.data.attributes.walsgitDiscussionCardsPrimaryCards,
      desktopCardWidth: app.forum.data.attributes.walsgitDiscussionCardsDesktopCardWidth,
      tabletCardWidth: app.forum.data.attributes.walsgitDiscussionCardsTabletCardWidth
    };
    if (!this.tagSettings.hasOwnProperty('primaryCards') || this.tagSettings.primaryCards === null) {
      this.tagSettings.primaryCards = defaultSettings.primaryCards;
    }
    if (!this.tagSettings.hasOwnProperty('desktopCardWidth') || this.tagSettings.desktopCardWidth === null) {
      this.tagSettings.desktopCardWidth = defaultSettings.desktopCardWidth;
    }
    if (!this.tagSettings.hasOwnProperty('tabletCardWidth') || this.tagSettings.tabletCardWidth === null) {
      this.tagSettings.tabletCardWidth = defaultSettings.tabletCardWidth;
    }
    this.tagSettings.primaryCards = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.tagSettings.primaryCards);
    this.tagSettings.desktopCardWidth = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.tagSettings.desktopCardWidth);
    this.tagSettings.tabletCardWidth = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.tagSettings.tabletCardWidth);
  };
  _proto.className = function className() {
    return "WdcTagSettingsModal Modal--large";
  };
  _proto.title = function title() {
    return [app.translator.trans("walsgit_discussion_cards.admin.tag_modal.title"), m("span", {
      className: "TagLabel colored",
      style: "--tag-bg: " + this.attrs.model.data.attributes.color + ";"
    }, m("span", {
      className: "TagLabel-text"
    }, m("span", {
      className: "TagLabel-name"
    }, this.attrs.model.data.attributes.name)))];
  };
  _proto.content = function content() {
    return [m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "Form"
    }, m("p", null, app.translator.trans("walsgit_discussion_cards.admin.tag_modal.intro_text")), m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "primaryCards"
    }, app.translator.trans("walsgit_discussion_cards.admin.tag_modal.primaryCards_label")), m("div", {
      className: "helpText"
    }, app.translator.trans("walsgit_discussion_cards.admin.tag_modal.primaryCards_help", {
      "default": defaultSettings.primaryCards
    })), m("input", {
      type: "number",
      name: "primaryCards",
      className: "FormControl DC-Number",
      bidi: this.tagSettings.primaryCards
    })), m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "desktopCardWidth"
    }, app.translator.trans("walsgit_discussion_cards.admin.tag_modal.desktopCardWidth_label")), m("div", {
      className: "helpText"
    }, app.translator.trans("walsgit_discussion_cards.admin.tag_modal.desktopCardWidth_help", {
      "default": defaultSettings.desktopCardWidth
    })), m("input", {
      type: "number",
      name: "desktopCardWidth",
      className: "FormControl DC-Number",
      bidi: this.tagSettings.desktopCardWidth
    })), m("div", {
      className: "Form-group"
    }, m("label", {
      htmlFor: "tabletCardWidth"
    }, app.translator.trans("walsgit_discussion_cards.admin.tag_modal.tabletCardWidth_label")), m("div", {
      className: "helpText"
    }, app.translator.trans("walsgit_discussion_cards.admin.tag_modal.tabletCardWidth_help", {
      "default": defaultSettings.tabletCardWidth
    })), m("input", {
      type: "number",
      name: "tabletCardWidth",
      className: "FormControl DC-Number",
      bidi: this.tagSettings.tabletCardWidth
    })), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default()), {
      type: "submit",
      className: "Button Button--primary",
      loading: this.loading,
      disabled: this.changed()
    }, app.translator.trans("walsgit_discussion_cards.admin.tag_modal.submit_button"))))];
  };
  _proto.changed = function changed() {
    var savedSettings = JSON.parse(this.attrs.model.data.attributes.walsgitDiscussionCardsTagSettings || 'null') || {};
    function isSameSettings(obj1, obj2) {
      if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
      }
      if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
      }
      for (var key in obj1) {
        if (obj1.hasOwnProperty(key)) {
          if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
            if (!compareObjects(obj1[key], obj2[key])) {
              return false;
            }
          } else if (obj1[key] !== obj2[key]) {
            return false;
          }
        }
      }
      return true;
    }
    return isSameSettings(JSON.parse(JSON.stringify(this.tagSettings)), savedSettings);
  };
  _proto.onsubmit = function onsubmit(e) {
    e.preventDefault();
    var primaryCards = parseInt(this.tagSettings.primaryCards());
    if (isNaN(primaryCards) || primaryCards < 0) {
      app.alerts.show({
        type: 'error'
      }, app.translator.trans('walsgit_discussion_cards.admin.errors.primaryCards'));
      return;
    }
    var desktopWidth = parseInt(this.tagSettings.desktopCardWidth());
    if (isNaN(desktopWidth) || desktopWidth < 10 || desktopWidth > 100) {
      app.alerts.show({
        type: 'error'
      }, app.translator.trans('walsgit_discussion_cards.admin.errors.desktopCardWidth'));
      return;
    }
    var tabletWidth = parseInt(this.tagSettings.tabletCardWidth());
    if (isNaN(tabletWidth) || tabletWidth < 10 || tabletWidth > 100) {
      app.alerts.show({
        type: 'error'
      }, app.translator.trans('walsgit_discussion_cards.admin.errors.tabletCardWidth'));
      return;
    }
    var tag = this.attrs.model;
    this.tagSettings.primaryCards(primaryCards);
    this.tagSettings.desktopCardWidth(desktopWidth);
    this.tagSettings.tabletCardWidth(tabletWidth);
    var tagSettings = JSON.stringify(this.tagSettings);
    this.loading = true;
    app.request({
      method: "PATCH",
      url: app.forum.attribute("apiUrl") + "/tags/" + tag.id() + "/tagSettings",
      body: {
        data: {
          tagSettings: tagSettings
        }
      }
    }).then(function () {
      tag.data.attributes.walsgitDiscussionCardsTagSettings = tagSettings;
      app.modal.close();
    });
  };
  return WdcTagSettingsModal;
}((flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/admin/helpers/isExtensionActive.js":
/*!************************************************!*\
  !*** ./src/admin/helpers/isExtensionActive.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isExtensionActive)
/* harmony export */ });
function isExtensionActive(extensionName) {
  if (app.data.settings.extensions_enabled.includes(extensionName)) {
    return true;
  }
  return false;
}

/***/ }),

/***/ "./src/admin/helpers/isExtensionInstalled.js":
/*!***************************************************!*\
  !*** ./src/admin/helpers/isExtensionInstalled.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isExtensionInstalled)
/* harmony export */ });
function isExtensionInstalled(extensionName) {
  if (app.data.extensions.hasOwnProperty(extensionName)) {
    return true;
  }
  return false;
}

/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_Settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Settings */ "./src/admin/components/Settings.js");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/tags/models/Tag */ "flarum/tags/models/Tag");
/* harmony import */ var flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/tags/components/EditTagModal */ "flarum/tags/components/EditTagModal");
/* harmony import */ var flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_WdcTagSettingsModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/WdcTagSettingsModal */ "./src/admin/components/WdcTagSettingsModal.js");
/* harmony import */ var _components_UploadTagImageButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/UploadTagImageButton */ "./src/admin/components/UploadTagImageButton.js");










flarum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add("walsgit/discussion-cards", function () {
  (flarum_tags_models_Tag__WEBPACK_IMPORTED_MODULE_6___default().prototype).WdcDefaultImage = flarum_common_Model__WEBPACK_IMPORTED_MODULE_3___default().attribute("walsgit_discussion_cards_tag_default_image");
  (0,flarum_extend__WEBPACK_IMPORTED_MODULE_2__.extend)((flarum_tags_components_EditTagModal__WEBPACK_IMPORTED_MODULE_7___default().prototype), "fields", function (items) {
    var _this = this;
    if (this.tag.id()) {
      var allowedTags = JSON.parse(flarum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('walsgitDiscussionCardsAllowedTags'));
      var isActivatedForTag = allowedTags.includes(this.tag.id());
      var activationBtnClasses = isActivatedForTag ? "DC-ActivationBtn Button activated" : "DC-ActivationBtn Button Button--primary";
      var DcTagSettingsClasses = isActivatedForTag ? "DC-TagSettings" : "DC-TagSettings DC-Hidden";
      var activationBtnText = isActivatedForTag ? flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("walsgit_discussion_cards.admin.tags.deactivation_button") : flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("walsgit_discussion_cards.admin.tags.activation_button");
      var toggleActivation = function toggleActivation() {
        isActivatedForTag = !isActivatedForTag;
        if (isActivatedForTag) {
          allowedTags.push(_this.tag.id());
        } else {
          allowedTags = allowedTags.filter(function (id) {
            return id !== _this.tag.id();
          });
        }
        flarum_app__WEBPACK_IMPORTED_MODULE_0___default().request({
          method: "POST",
          url: flarum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute("apiUrl") + "/walsgit_discussion_cards_tag_update_allowedTags",
          body: {
            allowedTags: allowedTags
          }
        }).then(function () {
          (flarum_app__WEBPACK_IMPORTED_MODULE_0___default().forum).data.attributes.walsgitDiscussionCardsAllowedTags = JSON.stringify(allowedTags);
          (flarum_app__WEBPACK_IMPORTED_MODULE_0___default().data).settings.walsgit_discussion_cards_allowedTags = JSON.stringify(allowedTags);
          isActivatedForTag = !isActivatedForTag;
          activationBtnClasses = isActivatedForTag ? "DC-ActivationBtn Button activated" : "DC-ActivationBtn Button Button--primary";
          DcTagSettingsClasses = isActivatedForTag ? "DC-TagSettings" : "DC-TagSettings DC-Hidden";
          activationBtnText = isActivatedForTag ? flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("walsgit_discussion_cards.admin.tags.deactivation_button") : flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("walsgit_discussion_cards.admin.tags.activation_button");
          m.redraw();
        });
      };
      items.add("tag-discussion-cards-options", m("fieldset", {
        className: "DC-Fieldset"
      }, m("legend", null, flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("walsgit_discussion_cards.admin.tags.options_heading")), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
        className: activationBtnClasses,
        icon: "fas fa-border-all",
        onclick: toggleActivation
      }, activationBtnText), m("div", {
        className: DcTagSettingsClasses
      }, m("div", {
        className: "DC-TagDefaultImageSettings"
      }, m("h4", null, flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("walsgit_discussion_cards.admin.tags.defaultImage_title")), m("p", {
        className: "helpText"
      }, flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("walsgit_discussion_cards.admin.tags.defaultImage_info")), m(_components_UploadTagImageButton__WEBPACK_IMPORTED_MODULE_9__["default"], {
        name: "walsgit_discussion_cards_tag_default_image",
        className: "DC-UploadTagImageBtn",
        ariaLabel: "Upload a default image for this tag",
        tagId: this.tag.id()
      })), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
        className: "Button Button--primary",
        icon: "fas fa-border-all",
        onclick: function onclick() {
          flarum_app__WEBPACK_IMPORTED_MODULE_0___default().modal.show(_components_WdcTagSettingsModal__WEBPACK_IMPORTED_MODULE_8__["default"], {
            model: _this.tag
          });
        }
      }, flarum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("walsgit_discussion_cards.admin.tags.options_button")))), -20);
    }
  });
  flarum_app__WEBPACK_IMPORTED_MODULE_0___default().extensionData["for"]("walsgit-discussion-cards").registerPage(_components_Settings__WEBPACK_IMPORTED_MODULE_1__["default"]);
});

/***/ }),

/***/ "flarum/admin/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['admin/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/app'];

/***/ }),

/***/ "flarum/admin/components/ExtensionPage":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['admin/components/ExtensionPage']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/ExtensionPage'];

/***/ }),

/***/ "flarum/admin/components/UploadImageButton":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['admin/components/UploadImageButton']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/UploadImageButton'];

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/Modal":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Modal']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Modal'];

/***/ }),

/***/ "flarum/common/helpers/icon":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/icon']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/icon'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/Stream'];

/***/ }),

/***/ "flarum/common/utils/classList":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/utils/classList']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/classList'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/tags/components/EditTagModal":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['tags/components/EditTagModal']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/components/EditTagModal'];

/***/ }),

/***/ "flarum/tags/models/Tag":
/*!********************************************************!*\
  !*** external "flarum.core.compat['tags/models/Tag']" ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/models/Tag'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
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
  !*** ./admin.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");
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
//# sourceMappingURL=admin.js.map