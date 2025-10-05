import Link from 'flarum/common/components/Link';
import sortTags from 'flarum/tags/utils/sortTags';

export default function craftTags(tags) {
  if (tags) {
    return [sortTags(tags).map(function (tag) {
      return [
        <Link className="cardTag"
              style={{backgroundColor: tag.color()}}
              href={app.route('tag', {tags: tag.slug()})}
        >
          {tag.icon() 
            ? <i className={'TagLabel-icon icon ' + tag.icon()} aria-hidden="true"></i>
            : ""
          } 
          {tag.name()}

        </Link>
      ]
    })];
  }
};
