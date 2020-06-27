var sec, btn;

fetch('/emojis').then(res => { return res.json() }).then(data => { console.log(data); setEmojis(data) })


function setEmojis(data) {
    var flag = 0
    var container = document.querySelector('.group')
    data.forEach(e1 => {
        //var h2 = document.createElement('h2')
        //h2.setAttribute('class', 'sub-group-name')
        var subgroup = document.createElement('div')
        subgroup.setAttribute('class', `subgroup ${!flag ? 'active' : ''}`)
        flag = 1
        var emoji_box = document.createElement('div')
        emoji_box.setAttribute('class', 'emoji-box')
        //h2.innerHTML = e1.group
        //subgroup.appendChild(h2)
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
        if (subgroup.innerHTML != '') {
            //subgroup.appendChild(emoji_box)
            container.appendChild(subgroup)
        }

    });
    sec = document.querySelectorAll('.subgroup');
    btn = document.querySelectorAll('.show-emoji')
    const emojis = document.querySelectorAll('.emojis')
    emojis.forEach(emoji => {
        emoji.addEventListener('click', e => {
            var text = emoji.getAttribute('emoji-name');
            navigator.clipboard.writeText(text).then(function () {
                console.log('Async: Copying to clipboard was successful!');
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });
            emoji.style.setProperty('--tooltip-content', '"copied"');
        })
        emoji.addEventListener('mouseout', e => {
            emoji.style.setProperty('--tooltip-content', '"copy"');
        })
    })
    console.log(sec[0])
}
var now = 0;
function clk(e) {
    console.log('a')
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
