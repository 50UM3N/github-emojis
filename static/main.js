var sec, btn, now = 1;;

// when user type anything on the searched box
const input = document.getElementById('emoji-input')
input.addEventListener('input', e => {
    // check the input box is empty or not  
    if (!input.value) {
        return
    }
    const value = input.value.replace(/\s/g, '') //replace all the spaces 
    fetch(`/type/${value}`).then(res => {
        return res.json()
    }).then(data => setDataToSearchBox(data))
})

// set the data to the searched result container 
function setDataToSearchBox(data) {
    //delete the previously searched items
    deleteBox()
    const box = document.querySelector('.result-box-container') //! <div class="result-box-container">...</div>
    const container = document.createElement('div') //! <div class="result-container">...</div>
    container.setAttribute('class', 'result-container')
    data.forEach(d => {
        const emoji = document.createElement('div') //! <div class="emoji" emoji-name="...">...</div
        emoji.setAttribute('class', 'emoji')
        emoji.setAttribute('emoji-name', `:${d.name}:`)
        const img = document.createElement('img') //! <img src="https://......">
        img.setAttribute('src', d.url)
        emoji.appendChild(img)
        container.appendChild(emoji)
        /*
            as this function call after the asynchronous function in this 
            reason we have to add the code copy event listener to the searched  emojis
            when user want to copy the code to the searched emojis
        */
        emoji.addEventListener('mousedown', e => {
            const target = emoji.cloneNode(true)
            // add the emojis to the recent 
            addToRecent(target, sec[0])
            const text = emoji.getAttribute('emoji-name')
            navigator.clipboard.writeText(text)
            emoji.style.setProperty('--tooltip-content', '"copied"')
        })
        emoji.addEventListener('mouseout', e => {
            emoji.style.setProperty('--tooltip-content', '"copy"')
        })
    })
    box.appendChild(container)
}

//this function delete the previous searched result if it exist
function deleteBox() {
    const box = document.querySelector('.result-container')
    if (box != null) {
        box.remove()
    }
}

// when the search result box is open ad the user click the any of the searched emojis, grouped emojis or outside of the result container this it close the container
document.addEventListener('mousedown', e => {
    const target1 = document.getElementById('emoji-input')
    const target2 = document.querySelector('.result-box-container')
    const target3 = document.querySelector('.result-container')
    const target4 = document.querySelectorAll('.e15')
    if (e.target != target1 && e.target != target2 && e.target != target3 && e.target != target4) {
        target2.classList.remove('result-box-container-visible')
    }

})

//this function is showing the search result box, this function is associated with <input onfocus="showBox()" type="text" id="emoji-input" placeholder="Search" />
function showBox() {
    document.querySelector('.result-box-container').classList.add('result-box-container-visible')
}

fetch('/emojis').then(res => {
    return res.json()
}).then(data => {
    setEmojis(data)
})

function setEmojis(data) {
    var flag = 0
    const container = document.querySelector('.group') //! <div class="group></div>"
    data.forEach(element1 => {
        const subgroup = document.createElement('div')
        subgroup.setAttribute('class', `subgroup ${!flag ? 'active' : ''} `) //! <div class="subgroup></div>"
        flag = 1
        element1.sub_group.forEach(element2 => {
            if (!element2.emojis) return
            element2.emojis.forEach(element3 => {
                const emoji = document.createElement('div') //! <div class="emoji" emoji-name="...">...</div
                emoji.setAttribute('class', 'emoji')
                emoji.setAttribute('emoji-name', `:${element3.name}:`) //! <img src="https://......">
                var img = document.createElement('img')
                img.setAttribute('src', `${element3.url}`)
                emoji.appendChild(img)
                subgroup.appendChild(emoji)
            })
        })
        // check that a subgroup container is empty or not if that is empty then not need to add on group container
        if (subgroup.innerHTML != '') {
            container.appendChild(subgroup)
        }
    });
    /* 
      setting the emoji subgroups to the global variable as the subgroup are added asynchronously
      in this reason we have to set the tabs in asynchronous function 
    */
    setTabs(document.querySelectorAll('.subgroup'), document.querySelectorAll('.show-emoji'))
    // setting the eventListener for all the emojis when user click the emojis it copy the emoji code
    setEventListener(document.querySelectorAll('.emoji'))
}

// emojis eventListener for coup the emojis code
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


// when user click a emoji this function add that emojis in recent tab and also add the on localStorage
function addToRecent(target, container) {
    //check that the emojis which is going tho add in recent is already exist or not
    let flag = 0;
    container.childNodes.forEach(e => {
        if (e.getAttribute('emoji-name') == target.getAttribute('emoji-name')) flag = 1
    })
    if (flag) {
        return
    }
    /*
        as this function call after the asynchronous function in this 
        reason we have to add the code copy event listener to the recently added emojis
        when user want to copy the code to the recent emojis
    */
    target.addEventListener('click', e => {
        const text = target.getAttribute('emoji-name')
        navigator.clipboard.writeText(text)
        target.style.setProperty('--tooltip-content', '"copied"')
    })
    target.addEventListener('mouseout', e => {
        target.style.setProperty('--tooltip-content', '"copy"')
    })
    //Set the recently user emoji to the local storage 
    setLocalStorage(target.getAttribute('emoji-name'), target.childNodes[0].getAttribute('src'))
    container.insertBefore(target, container.childNodes[0]);
}

// setting the emojis code and it's url to the localStorage array objects name emojis:[{...},{...}.....]
function setLocalStorage(key, value) {
    var emojis = localStorage.getItem(localStorage.key(0))
    if (emojis) {
        emojis = JSON.parse(emojis)
        emojis.push({
            name: key,
            url: value
        })
    } else {
        emojis = [{
            name: key,
            url: value
        }]
    }
    localStorage.setItem('emoji', JSON.stringify(emojis))
}

/* if there is any recent emojis set in localStorage then add to the recent tabs as the function is 
call before asynchronous function in this reason we don't have to add eventListener which help to cpy 
the emoji code*/
function setRecentItems() {
    var emojis = localStorage.getItem(localStorage.key(0))
    if (emojis) {
        emojis = JSON.parse(emojis)
        emojis.forEach(emoji => {
            const container = document.querySelectorAll('.subgroup')
            const img = document.createElement('img')
            const emojis = document.createElement('div')
            emojis.setAttribute('class', 'emoji')
            emojis.setAttribute('emoji-name', emoji.name)
            img.setAttribute('src', emoji.url)
            emojis.appendChild(img)
            container[0].insertBefore(emojis, container[0].childNodes[0])
        })
    }
}


// set the tabs i.e subgroups array combination ofr bellow three functions clk addItem and removeItem
function setTabs(section, button) {
    sec = section
    btn = button
}

// this function is associated with html <button id="b*" class="show-emoji" onclick="clk(this.id)">...</button>
function clk(e) {
    removeItem(now);
    now = Number(e.slice(1));
    addItem(now);
}

function addItem(e) {
    sec[e].classList.add('active')
    btn[e].classList.add('button-active')
}

function removeItem(e) {
    sec[e].classList.remove('active')
    btn[e].classList.remove('button-active')
}

setRecentItems()