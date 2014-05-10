({
    block: 'page',
    title: 'Вэйцы. Пример режима игры.',
    head: {elem: 'css', url: 'common.css'},
    content: [
        {
            block: 'goban',
            mods: {mode: 'game'}
        },
        {elem: 'js', url: 'browser.js'}
    ]
});
