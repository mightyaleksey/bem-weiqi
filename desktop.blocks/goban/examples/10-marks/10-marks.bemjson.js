({
    block: 'page',
    title: 'Пример разметки',
    head: [
        {elem: 'css', url: 'common.css'}
    ],
    content: [
        {
            block: 'example',
            js: true,
            content: {
                block: 'goban',
                mods: {
                    marking: 'yes',
                    size: 'm',
                    theme: 'eidogo'
                }
            }
        },
        {elem: 'js', url: 'browser.js'}
    ]
})
