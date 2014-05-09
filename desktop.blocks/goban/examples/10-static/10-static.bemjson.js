({
    block: 'page',
    title: 'Вэйцы. Пример статических диаграмм.',
    head: {
        elem: 'css', url: 'common.css'
    },
    content: [
        {
            block: 'goban',
            mods: {
                mode: 'static'
            },
            js: {
                sgf: '(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]RU[Japanese]SZ[19]KM[0.00]PW[Weiqi]PB[User]AW[da][ab][bb][cb][db]AB[eb][fb][bc][cc][dc][bd][ed])'
            }
        },
        {
            elem: 'js', url: 'browser.js'
        }
    ]
});
