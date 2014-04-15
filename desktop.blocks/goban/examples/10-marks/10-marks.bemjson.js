({
    block: 'page',
    title: 'Пример разметки',
    head: [
        {elem: 'css', url: '_10-marks.css'}
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
        {elem: 'js', url: '_10-marks.js'}
    ]
})
