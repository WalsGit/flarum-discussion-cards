import Extend from 'flarum/common/extenders';
import app from 'flarum/admin/app';

import Settings from './components/Settings';

export default [
    new Extend.Admin()
        .page(Settings)
]