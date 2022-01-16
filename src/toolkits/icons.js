import * as Utils from 'toolkits/utils'

const icons = {
    actions: {
        3: 'https://ffxiv.gamerescape.com/w/images/a/a8/Sprint_Icon.png',
    },
    markers: {
        target: [
            null,
            'https://ffxiv.gamerescape.com/w/images/c/c2/Marker1_Icon.png',
            'https://ffxiv.gamerescape.com/w/images/b/b8/Marker2_Icon.png',
            'https://ffxiv.gamerescape.com/w/images/8/85/Marker3_Icon.png',
            'https://ffxiv.gamerescape.com/w/images/f/fa/Marker4_Icon.png',
            'https://ffxiv.gamerescape.com/w/images/1/1c/Marker5_Icon.png',
            'https://ffxiv.gamerescape.com/w/images/4/49/Marker15_Icon.png',
            'https://ffxiv.gamerescape.com/w/images/f/f5/Marker16_Icon.png',
            'https://ffxiv.gamerescape.com/w/images/a/ac/Marker17_Icon.png',
        ]
    }
}

export function get(path) {
    return Utils.getObjValue(icons, path)
}