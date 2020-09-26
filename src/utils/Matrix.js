import { normalize, cross, dot, add, negetive } from './Vector'

export const unit = (dim) => {
  let mat = []
  for(let i = 0; i < dim; i++) {
    let vector = new Array(dim).fill(0)
    vector[i] = 1
    mat.push(vector)
  }
  return mat
}

export const zero = (row, col) => {
  let res = []
  for(let i = 0; i < row; i++) {
    res.push([])
    for(let j = 0; j < col; j++) {
      res[i].push(0)
    }
  }
  return res;
}

export const multiple = (mat1, mat2) => {
  if(mat1[0].length !== mat2.length) {
    throw new Error('matrix dim error')
  }
  let row = mat1.length, col = mat2[0].length, l = mat1[0].length
  let res = zero(row, col)
  for(let i = 0; i < row; i++) {
    for(let j = 0; j < col; j++) {
      for(let k = 0; k < l; k++) {
        res[i][j] = res[i][j] + mat1[i][k] * mat2[k][j];
      }
    }
  }
  return res
}

export const multiplVec = (mat, vec) => {
  if(mat[0].length !== vec.length) {
    throw new Error('matrix dim error')
  }
  let mat2 = []
  vec.forEach(item => {
    mat2.push([item])
  })
  let tRes = multiple(mat, vec[0] instanceof Array ? vec : mat2)
  let res = []
  tRes.forEach(item => {
    res.push(item[0])
  })
  return res
}

export const rotation = (a, v) => {
  v = normalize(v)
  function f1(i) {
    return Math.cos(a) + v[i] * v[i] * (1 - Math.cos(a))
  }

  function f2(i, j, k, symbol) {
    return v[i] * v[j] * (1 - Math.cos(a)) + symbol * v[k] * Math.sin(a)
  }

  // return [
  //   [f1(0), f2(0, 1, 2, -1), f2(0, 2, 1, 1), 0],
  //   [f2(1, 0, 2, 1), f1(1), f2(1, 2, 0, -1), 0],
  //   [f2(2, 0, 1, -1), f2(2, 1, 0, 1), f1(2), 0],
  //   [0, 0, 0, 1]
  // ]

  return [
    [f1(0), f2(1, 0, 2, 1), f2(2, 0, 1, -1), 0],
    [f2(0, 1, 2, -1), f1(1), f2(2, 1, 0, 1), 0],
    [f2(0, 2, 1, 1), f2(1, 2, 0, -1), f1(2), 0],
    [0, 0, 0, 1]
  ]
}

export const translate = (vec) => {
  const x = vec[0]
  const y = vec[1]
  const z = vec[2]
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [x, y, z, 1]
  ]
}

export const scale = (vec) => {
  const x = vec[0]
  const y = vec[1]
  const z = vec[2]
  return [
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1]
  ]
}

export const lookAt = (eye, front, up) => {
    const f = normalize(front)
    const s = normalize(cross(f, up))
    const u = cross(s, f)

    let res = unit(4)
    res[0][0] = s[0];
    res[1][0] = s[1];
    res[2][0] = s[2];

    res[0][1] = u[0];
    res[1][1] = u[1];
    res[2][1] = u[2];

    res[0][2] = -f[0];
    res[1][2] = -f[1];
    res[2][2] = -f[2];

    res[3][0] = -dot(s, eye);
    res[3][1] = -dot(u, eye);
    res[3][2] = dot(f, eye);
    return res;
}


export const projection = (angle, rate, near, far) => {
  angle = Math.PI * angle / 180
  let tanHalfFovy = Math.tan(angle / 2)
  let res = zero(4, 4)
  res[0][0] = 1 / (tanHalfFovy * rate)
  res[1][1] = 1 / tanHalfFovy
  res[2][3] = -1

  res[2][2] = - (far + near) / (far - near);
  res[3][2] = - (2 * far * near) / (far - near);
  return res
}

export const toArray = mat => {
  let res = []
  for(let i = 0; i < mat.length; i++) {
    for(let j = 0; j < mat[0].length; j++) {
      res.push(mat[i][j])
    }
  }
  return res
}
