({
    block: 'page',
    title: 'Режим игры.',
    head: [
        {elem: 'css', url: 'common.css'}
    ],
    content: [
        {
            block: 'go',
            mods: {
                marking: 'yes',
                mode: 'game',
                size: 'm',
                theme: 'eidogo'
            }
        },
        ' ',
        {
            block: 'go',
            mods: {
                mode: 'game',
                size: 'm',
                theme: 'eidogo'
            }
        },
        {elem: 'js', url: 'browser.js'}
    ]
})
