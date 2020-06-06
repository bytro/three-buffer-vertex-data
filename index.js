import flatten from 'flatten-vertex-data'
import { BufferAttribute } from 'three'

function setIndex (geometry, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 1
  if (typeof dtype !== 'string') dtype = 'uint16'

  const attrib = updateAttribute(data, itemSize, dtype)
  if (attrib) {
    if (!geometry.index && typeof geometry.setIndex !== 'function') {
      geometry.addAttribute('index', attrib)
    } else {
      geometry.index = attrib
    }
  }
}

function setAttribute (geometry, key, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 3
  if (typeof dtype !== 'string') dtype = 'float32'
  if (Array.isArray(data) &&
    Array.isArray(data[0]) &&
    data[0].length !== itemSize) {
    throw new Error('Nested vertex array has unexpected size; expected ' +
      itemSize + ' but found ' + data[0].length)
  }

  const attrib = updateAttribute(data, itemSize, dtype)
  geometry.setAttribute(key, attrib)
}

function updateAttribute (data, itemSize, dtype) {
  data = data || []

  // create a new array with desired type
  data = flatten(data, dtype)

  const attrib = new BufferAttribute(data, itemSize);
  attrib.itemSize = itemSize;
  attrib.needsUpdate = true;

  return attrib
}

export { setIndex as index, setAttribute as attr }
