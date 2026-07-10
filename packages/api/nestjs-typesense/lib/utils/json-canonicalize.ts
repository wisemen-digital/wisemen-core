// oxlint-disable typescript/no-explicit-any, typescript-eslint(no-unsafe-member-access), typescript-eslint(no-unsafe-argument)
 
export interface ISerializeOptions {
  allowCircular?: boolean
  include?: string[]
  exclude?: string | string[]
  filterUndefined?: boolean
  undefinedInArrayToNull?: boolean
}

const CircularRootPathName = '$'

export function canonicalize (obj: any, allowCircular?: boolean) {
  return serialize(obj, {
    allowCircular,
    filterUndefined: true,
    undefinedInArrayToNull: true
  })
}

function serialize (obj: any, options?: ISerializeOptions) {
  let buffer = ''
  const vInclude = options && options.include
  let vExclude = options && options.exclude
  if (vExclude !== undefined) {
    if (typeof vExclude === 'string') vExclude = [vExclude]
  }
  if (vInclude) vInclude.sort()

  const visited = new WeakMap<object, string>()
  const allowCircular = options && options.allowCircular
  const filterUndefined = options && options.filterUndefined
  const undefinedInArrayToNull = options && options.undefinedInArrayToNull

  serialize(obj, CircularRootPathName)

  return buffer

  function serialize (object: any, path: string) {
    if (
      object === null
      || typeof object !== 'object'
      || object.toJSON != null
    ) {
      buffer += JSON.stringify(object)
    } else if (Array.isArray(object)) {
      const visitedPath = visited.get(object)
      if (visitedPath !== undefined) {
        if (path.startsWith(visitedPath)) {
          if (allowCircular !== true) {
            throw new Error('Circular reference detected')
          }
          buffer += '"[Circular:' + visitedPath + ']"'

          return
        }
      }
      visited.set(object, path)

      buffer += '['
      let next = false
      object.forEach((element, index) => {
        if (next) {
          buffer += ','
        }
        next = true
        if (undefinedInArrayToNull === true && element === undefined) {
          element = null
        }
        serialize(element, `${path}[${index}]`)
      })
      buffer += ']'
    } else {
      const visitedPath = visited.get(object)
      if (visitedPath !== undefined) {
        if (path.startsWith(visitedPath)) {
          if (allowCircular !== true) {
            throw new Error('Circular reference detected')
          }
          buffer += '"[Circular:' + visitedPath + ']"'

          return
        }
      }
      visited.set(object, path)

      buffer += '{'
      let next = false

      const addProp = (property: string) => {
        if (vExclude !== undefined && (vExclude as string[]).includes(property)) {
          return
        }

        if (next) {
          buffer += ','
        }
        next = true
        buffer += JSON.stringify(property)
        buffer += ':'
        serialize(object[property], `${path}.${property}`)
      }

      if (path === CircularRootPathName && vInclude) {
        vInclude.forEach((property) => {
          if (Object.hasOwn(object, property)) {
            addProp(property)
          }
        })
      } else {
        let vKeys = Object.keys(object)
        if (filterUndefined === true) {
          vKeys = vKeys.filter(k => object[k] !== undefined)
        }
        vKeys.sort()
        vKeys.forEach((property) => {
          addProp(property)
        })
      }
      buffer += '}'
    }
  }
}
