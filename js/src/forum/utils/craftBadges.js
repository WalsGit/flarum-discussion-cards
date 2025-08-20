import icon from 'flarum/common/helpers/icon';
import Tooltip from 'flarum/common/components/Tooltip';

export default function craftBadges(badges) {
  if (badges.length) {
    return [m('.cardBadges', [badges.map((badge) => {
      return [
        m(Tooltip, {
          text: badge.attrs.label ? badge.attrs.label[0] : '',
          position: 'right'
        },
        m('span.cardBadge.Badge.Badge--' + badge.attrs.type, [icon(badge.attrs.icon)]))]
    })])];
  }
};
