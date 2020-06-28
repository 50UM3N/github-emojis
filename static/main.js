var sec, btn, now = 1;;

const input = document.getElementById('emoji-input')
input.addEventListener('input', e => {
    deleteBox()
    if (!input.value) { return }
    const value = input.value.replace(/\s/g, '')
    fetch(`/type/${value}`).then(res => { return res.json() }).then(data => setDataToSearchBox(data))
})

function setDataToSearchBox(data) {
    const box = document.querySelector('.result-box-container')
    const emojiBox = document.createElement('div')
    emojiBox.setAttribute('class', 'result-container')
    data.forEach(d => {
        const ej = document.createElement('div')
        ej.setAttribute('class', 'emojis')
        ej.setAttribute('emoji-name', `:${d.name}:`)
        const img = document.createElement('img')
        img.setAttribute('src', d.url)
        ej.appendChild(img)
        emojiBox.appendChild(ej)
        ej.addEventListener('mousedown', e => {
            const text = ej.getAttribute('emoji-name')
            navigator.clipboard.writeText(text)
            ej.style.setProperty('--tooltip-content', '"copied"')
        })
        ej.addEventListener('mouseout', e => {
            ej.style.setProperty('--tooltip-content', '"copy"')
        })
    })
    box.appendChild(emojiBox)
}

function deleteBox() {
    const box = document.querySelector('.result-container')
    if (box != null) box.remove()
}

document.addEventListener('mousedown', e => {
    const t1 = document.getElementById('emoji-input')
    const t2 = document.querySelector('.result-box-container')
    const t3 = document.querySelector('.result-container')
    const t4 = document.querySelectorAll('.e15')
    if (e.target != t1 && e.target != t2 && e.target != t3 && e.target != t4) {
        t2.classList.remove('result-box-container-visible')
    }

})

function showBox() { document.querySelector('.result-box-container').classList.add('result-box-container-visible') }

fetch('/emojis').then(res => { return res.json() }).then(data => { setEmojis(data) })

function setEmojis(data) {
    var flag = 0
    var container = document.querySelector('.group')
    data.forEach(e1 => {
        var subgroup = document.createElement('div')
        subgroup.setAttribute('class', `subgroup ${!flag ? 'active' : ''} `)
        flag = 1
        var emoji_box = document.createElement('div')
        emoji_box.setAttribute('class', 'emoji-box')
        e1.sub_group.forEach(e2 => {
            if (!e2.emojis) return
            e2.emojis.forEach(e3 => {
                var e = document.createElement('div')
                e.setAttribute('class', 'emojis')
                e.setAttribute('emoji-name', `:${e3.name}:`)
                var img = document.createElement('img')
                img.setAttribute('src', `${e3.url}`)
                e.appendChild(img)
                subgroup.appendChild(e)
            })
        })
        if (subgroup.innerHTML != '') { container.appendChild(subgroup) }
    });
    setTabs(document.querySelectorAll('.subgroup'), document.querySelectorAll('.show-emoji'))
    setEventListener(document.querySelectorAll('.emojis'))
}

function setEventListener(emojis) {
    emojis.forEach(emoji => {
        emoji.addEventListener('mousedown', e => {
            const target = emoji.cloneNode(true)
            addToRecent(target, sec[0])
            const text = emoji.getAttribute('emoji-name')
            navigator.clipboard.writeText(text)
            emoji.style.setProperty('--tooltip-content', '"copied"')
        })
        emoji.addEventListener('mouseout', e => {
            emoji.style.setProperty('--tooltip-content', '"copy"')
        })
    })
}

function setTabs(section, button) {
    sec = section
    btn = button
}

function addToRecent(target, container) {
    let flag = 0;
    container.childNodes.forEach(e => { if (e.getAttribute('emoji-name') == target.getAttribute('emoji-name')) flag = 1 })
    if (flag) { return }
    target.addEventListener('click', e => {
        const text = target.getAttribute('emoji-name')
        navigator.clipboard.writeText(text)
        target.style.setProperty('--tooltip-content', '"copied"')
    })
    target.addEventListener('mouseout', e => {
        target.style.setProperty('--tooltip-content', '"copy"')
    })
    container.appendChild(target)
}

function clk(e) {
    remove(now);
    now = Number(e.slice(1));
    add(now);
}

function add(e) {
    sec[e].classList.add('active')
    btn[e].classList.add('button-active')
}

function remove(e) {
    sec[e].classList.remove('active')
    btn[e].classList.remove('button-active')
}
