//計算時鐘的角度
export const calculatevHour = (x) => {
    if (x <= 180 && x > 150) {
        return 9
    } else if (x <= 150 && x > 120) {
        return 10
    } else if (x <= 120 && x > 90) {
        return 11
    } else if (x <= 90 && x > 60) {
        return 12
    } else if (x <= 60 && x > 30) {
        return 1
    } else if (x <= 30 && x > 0) {
        return 2
    } else if (x <= 0 && x > -30) {
        return 3
    } else if (x <= -30 && x > -60) {
        return 4
    } else if (x <= -60 && x > -90) {
        return 5
    } else if (x <= -90 && x > -120) {
        return 6
    } else if (x <= -120 && x > -150) {
        return 7
    } else if (x <= -150 && x > -180) {
        return 8
    } else {
        return 0
    }
}

//計算角度
export const calcAngleDegrees = (x, y) => {
    const ChestMaxSize = 100
    x = x.toFixed(2) - ChestMaxSize / 2
    if (y > ChestMaxSize / 2) {
        y = -Math.abs(y.toFixed(2) - ChestMaxSize / 2)
    } else {
        y = Math.abs(y.toFixed(2) - ChestMaxSize / 2)
    }
    return (Math.atan2(y, x) * 180) / Math.PI
}

//計算距離圓心的距離
export const PythagoreanTheorem = (x, y) => {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

export const listText = (azimut) => {
    const text =
        calculatevHour(calcAngleDegrees(azimut.Azimut.x, azimut.Azimut.y)) +
        '點鐘，距離' +
        PythagoreanTheorem(Math.abs(azimut.Azimut.x / 10 - 10), Math.abs(azimut.Azimut.y / 10 - 10)).toFixed(2) +
        '公分，大小' +
        azimut.Size +
        'mm'
    return text
}
