({
    block: 'page',
    title: 'Вэйцы. Пример доски с разметкой и без.',
    head: {elem: 'css', url: 'common.css'},
    content: [
        {
            block: 'goban',
            mods: {marking: 'yes', size: 's', theme: 'eidogo'}
        },
        ' ',
        {
            block: 'goban',
            mods: {size: 's', theme: 'eidogo'}
        },
        {tag: 'br'},
        {
            block: 'goban',
            mods: {marking: 'yes', size: 'm', theme: 'eidogo'}
        },
        ' ',
        {
            block: 'goban',
            mods: {size: 'm', theme: 'eidogo'}
        },
        {tag: 'br'},
        {
            block: 'goban',
            mods: {marking: 'yes', size: 'b', theme: 'eidogo'}
        },
        ' ',
        {
            block: 'goban',
            mods: {size: 'b', theme: 'eidogo'}
        },
        {elem: 'js', url: 'browser.js'}
    ]
});
