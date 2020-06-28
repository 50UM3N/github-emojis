const cheerio = require('cheerio')
const axios = require("axios")
const FileSystem = require("fs")
require('dotenv').config();
const url = process.env.EMOJIS_SITE_URL;

//get the emojis from github
function getGitHubEmojis() {
    axios('https://api.github.com/emojis')
        .then(response => {
            const emoji = makeGitHubEmojisObject(response.data)
            getCategorizedEmojis(emoji)
        })
        .catch(e => {
            console.log(e)
        })
}

//get the website for webscraping
function getCategorizedEmojis(emoji) {
    axios(url)
        .then(response => {
            const html = response.data;
            makeCategorizedObject(html, emoji)
        })
        .catch(console.error);
}

//make the actual json file where the categorized store using webscraping using cheerio
function makeCategorizedObject(html, emoji) {
    let a = [], b = [], c = []
    const $ = cheerio.load(html).root()
    const table = $.find('tbody').children().toArray();
    table.forEach(tr => {
        if (tr.firstChild.name == 'th') {
            if (tr.firstChild.attribs.class == process.env.SE1) {
                a.push({ group: tr.firstChild.firstChild.firstChild.nodeValue })
                b = []

            }
            else if (tr.firstChild.attribs.class == process.env.SE2) {
                b.push({ sg_name: tr.firstChild.firstChild.firstChild.nodeValue })
                a[a.length - 1].sub_group = b
                c = []
            }
        }
        else if (tr.firstChild.name == 'td') {
            const code = tr.children[2].firstChild.attribs.name.replace(/_200d/g, "").replace(/_fe0f/g, "").replace(/_fe00/g, "").replace(/_/g, '-') //need to review
            const keyword = tr.children[8].firstChild.data.replace(/\s/g, '').split('|')
            if (emoji[code] != undefined) {
                const key = emoji[code].name
                const value = emoji[code].url
                delete emoji[code]
                c.push({ name: key, url: value, keyword: keyword })
                a[a.length - 1].sub_group[a[a.length - 1].sub_group.length - 1].emojis = c
            }
        }
    })
    b = []
    for (key in emoji) {
        b.push({ name: emoji[key].name, url: emoji[key].url })
    }
    a.push({ group: 'GitHub Custom Emoji' })
    a[a.length - 1].sub_group = []
    a[a.length - 1].sub_group.push({ sg_name: 'gh_emojis', emojis: b })
    FileSystem.writeFile('emojis.json', JSON.stringify(a), (err) => { if (err) throw err; });
    console.log('done')
}

//categorized the emojis using id :{name,url}
function makeGitHubEmojisObject(data) {
    let emoji = {}
    for (key in data) {
        const arr = data[key].split('/')
        const id = arr[arr.length - 1].split('.png')[0]
        emoji[id] = { name: key, url: data[key] }
    }
    return emoji
}

getGitHubEmojis()