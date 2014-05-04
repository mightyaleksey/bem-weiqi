({
    block: 'page',
    title: 'Tests.',
    head: [
        {elem: 'css', url: 'common.css'}
    ],
    content: [
        {block: 'mocha'},
        {elem: 'js', url: 'browser.js'}
    ]
})
