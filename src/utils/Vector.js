export const length = (vec) => {
  let s = 0
  for(let i = 0; i < vec.length; i++) {
    s += vec[i] * vec[i]
  }
  return Math.sqrt(s)
}

export const normalize = vec => {
  let res = []
  for(let i = 0; i < vec.length; i++) {
    res.push(vec[i] / length(vec))
  }
  return res
}

export const castTo = (vec, length) => {
  if(length > vec.length) {
    throw new Error(`vector dim less than ${length}`)
  }
  let res = []
  for(let i = 0; i < length; i++) {
    res.push(vec[i])
  }
  return res
}

export const add = (vec1, vec2) => {
  if(vec1.length !== vec2.length) {
    throw new Error('vector dim not equal')
  }
  let res = []
  for(let i = 0; i < vec1.length; i++) {
    res.push(vec1[i] + vec2[i])
  }
  return res
}

export const minus = (vec1, vec2) => {
  if(vec1.length !== vec2.length) {
    throw new Error('vector dim not equal')
  }
  let res = []
  for(let i = 0; i < vec1.length; i++) {
    res.push(vec1[i] - vec2[i])
  }
  return res
}

export const multiple = (vec1, vec2) => {
  if(vec1.length !== vec2.length) {
    throw new Error('vector dim not equal')
  }
  let res = []
  for(let i = 0; i < vec1.length; i++) {
    res.push(vec1[i] * vec2[i])
  }
  return res
}

export const numberMultiple = (vec, num) => {
  let res = []
  vec.forEach((item, idx) => {
    res.push(item * num)
  })
  return res
}

export const negetive = (vec) => {
  let res = []
  vec.forEach(item => {
    res.push(-item)
  })
  return res
}

export const dot = (vec1, vec2) => {
  if(vec1.length !== vec2.length) {
    throw new Error('vector dim not equal')
  }
  let res = 0
  for(let i = 0; i < vec1.length; i++) {
    res += vec1[i] * vec2[i]
  }
  return res
}

export const cross = (vec1, vec2) => {
  if(vec1.length !== 3 || vec2.length !== 3) {
    throw new Error("vector cross dim not equal 3")
  }
  return [
    vec1[1] * vec2[2] - vec1[2] * vec2[1],
    vec1[2] * vec2[0] - vec1[0] * vec2[2],
    vec1[0] * vec2[1] - vec1[1] * vec2[0]
  ]
}

export const reflect = (vec1, vec2) => {
  return minus(vec1, numberMultiple(vec2, 2 * dot(vec1, vec2)))
}
