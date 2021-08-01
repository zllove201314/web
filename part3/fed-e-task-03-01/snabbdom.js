import { h, init } from 'snabbdom'
import { clazz } from 'snabbdom/modules/class'
import { props } from 'snabbdom/modules/props'
import { style } from 'snabbdom/modules/style'
import { listeners } from 'snabbdom/modules/eventlisteners'

var patch = init([clazz, props, style, listeners])
var vnode;

var nextKey = 8;
var margin = 8;
var sortBy = 'rank';
var totalHeight = 0;
var originalData = [
    {rank: 1, title: 'HTML', desc: '超文本标记语言.1', elmHeight: 0},
    {rank: 2, title: 'CSS', desc: '样式2', elmHeight: 0},
    {rank: 3, title: 'JAVASCRIPT', desc: '脚本语言/动态/弱类型3', elmHeight: 0},
    {rank: 4, title: 'PYTHON', desc: '机器学习/深度学习/爬虫4', elmHeight: 0},
    {rank: 5, title: 'TYPESCRIPT', desc: '解决JAVASCRIPT的类型问题5', elmHeight: 0},
    {rank: 6, title: 'VUE', desc: '前端框架6', elmHeight: 0},
    {rank: 7, title: 'C++', desc: '偏底层，效率高，嵌入式开发7', elmHeight: 0},
];
var data = [
    originalData[0],
    originalData[1],
    originalData[2],
    originalData[3],
    originalData[4],
    originalData[5],
    originalData[6],
    originalData[7],
    originalData[8],
    originalData[9],
];

function changeSort(prop) {
    sortBy = prop;
    data.sort((a, b) => {
        if (a[prop] > b[prop]) {
            return 1;
        }
        if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    });
    render();
}

function add() {
    var n = originalData[Math.floor(Math.random() * 10)];
    data = [{rank: nextKey++, title: n.title, desc: n.desc, elmHeight: 0}].concat(data);
    render();
    render();
}

function remove(movie) {
    data = data.filter((m) => { return m !== movie; });
    render();
}

function movieView(movie) {
    return h('div.row', {
        key: movie.rank,
        style: {opacity: '0', transform: 'translate(-200px)',
            delayed: {transform: `translateY(${movie.offset}px)`, opacity: '1'},
            remove: {opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)`}},
        hook: {insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight; }},
    }, [
        h('div', {style: {fontWeight: 'bold'}}, movie.rank),
        h('div', movie.title),
        h('div', movie.desc),
        h('div.btn.rm-btn', {on: {click: [remove, movie]}}, 'x'),
    ]);
}

function render() {
    data = data.reduce((acc, m) => {
        var last = acc[acc.length - 1];
        m.offset = last ? last.offset + last.elmHeight + margin : margin;
        return acc.concat(m);
    }, []);
    totalHeight = data[data.length - 1].offset + data[data.length - 1].elmHeight;
    vnode = patch(vnode, view(data));
}

function view(data) {
    return h('div', [
        h('h1', 'Top 10 movies'),
        h('div', [
            h('a.btn.add', {on: {click: add}}, 'Add'),
            'Sort by: ',
            h('span.btn-group', [
                h('a.btn.rank', {class: {active: sortBy === 'rank'}, on: {click: [changeSort, 'rank']}}, 'Rank'),
                h('a.btn.title', {class: {active: sortBy === 'title'}, on: {click: [changeSort, 'title']}}, 'Title'),
                h('a.btn.desc', {class: {active: sortBy === 'desc'}, on: {click: [changeSort, 'desc']}}, 'Description'),
            ]),
        ]),
        h('div.list', {style: {height: totalHeight+'px'}}, data.map(movieView)),
    ]);
}

window.addEventListener('DOMContentLoaded', () => {
    var container = document.getElementById('container');
    vnode = patch(container, view(data));
    render();
})