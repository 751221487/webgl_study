export const angle2Radian = angle => Math.PI * angle / 180

export const colorToRate = color => [color[0] / 255, color[1] / 255, color[2] / 255]
export const rateToColor = color => [color[0] * 255, color[1] * 255, color[2] * 255]