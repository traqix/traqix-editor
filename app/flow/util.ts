import { useEffect, useRef } from 'react'
import randColor from 'randomcolor'
import { customAlphabet } from 'nanoid'
import Color from 'color'
import * as T from './types'

export function addMaybe(nums: (number | undefined)[]) {
  return nums.reduce((p, c) => (p || 0) + (c || 0), 0)
}

export function copy(x: any) {
  return JSON.parse(JSON.stringify(x))
}

const characters =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export const makeId = {
  small: customAlphabet(characters, 5),
  medium: customAlphabet(characters, 10),
  large: customAlphabet(characters, 15),
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((s) => s[0])
    .join('')
    .toUpperCase()
}

export function darken(color: string, level: number) {
  return Color(color).darken(level).hex()
}

export function sortItemsBy<Item extends object>(
  arr: Item[],
  property: keyof Item,
): Item[] {
  return arr.sort((a: Item, b: Item) => {
    if (a[property] && b[property]) {
      return (a[property] as any).localeCompare(b[property], 'en', {
        numeric: true,
        sensitivity: 'base', //  Only strings that differ in base letters compare as unequal, eg a = A
      })
    }
    return 1
  })
}

export function randBg() {
  return randColor({
    luminosity: 'light',
    format: 'rgba',
    alpha: 0.4,
  })
}

export function walkTree<T extends object>(
  top: T,
  subKey: keyof T,
  fn: (item: T, parent?: T) => void,
  _parent?: T,
) {
  if (top) {
    fn(top, _parent)
    if (top[subKey]) {
      ;(top as any)[subKey].forEach((item: T) => {
        walkTree(item, subKey, fn, top)
      })
    }
  }
}

export function containsElement(parent: T.Element, id: string) {
  let check = false
  walkTree(parent, 'children', (el) => {
    if (el.id === id) {
      check = true
    }
  })
  return check
}

export function comp(name: string): T.Element {
  return {
    id: name,
    name,
    type: 'comp',
  }
}
export function group(name: string, children: T.Elements): T.Element {
  return {
    id: name,
    name,
    type: 'group',
    children,
    bg: randBg(),
  }
}
let connCount = 0
export function conn(a: string, b: string): T.Connection {
  connCount++
  return {
    id: `c${connCount}`,
    comp1: a,
    comp2: b,
  }
}

export function createBus<Messages>() {
  type MessageNames = keyof Messages

  let messageHandlers: any = {}

  function on<M extends MessageNames>(
    msg: M,
    reference: string,
    fn: (value: Messages[M]) => void,
  ) {
    messageHandlers[msg] = messageHandlers[msg] || {}
    messageHandlers[msg][reference] = fn
  }

  function emit<M extends MessageNames>(msg: M, value: Messages[M]) {
    if (messageHandlers[msg]) {
      Object.keys(messageHandlers[msg]).forEach((ref) => {
        if (messageHandlers[msg][ref]) {
          messageHandlers[msg][ref](value)
        }
      })
    }
  }

  function clear<M extends MessageNames>(msg: M, ref: string) {
    if (messageHandlers[msg]) {
      if (messageHandlers[msg][ref]) {
        delete messageHandlers[msg][ref]
      }
    }
  }

  function clearAll() {
    messageHandlers = {}
  }

  function useClear<M extends MessageNames>(msg: M, ref: string) {
    useEffect(() => {
      return () => {
        clear(msg, ref)
      }
    }, [msg, ref])
  }

  // This should always be used when setting up a listener
  // inside a functional component since it will automatically
  // clean up when the component unmounts. Otherwise you may
  // have functions trying to set state for unmounted components.
  function useOn<M extends MessageNames>(
    msg: M,
    reference: string,
    fn: (value: Messages[M]) => void,
  ) {
    messageHandlers[msg] = messageHandlers[msg] || {}
    messageHandlers[msg][reference] = fn
    useClear(msg, reference)
  }

  function useClearAll() {
    useEffect(() => {
      return () => {
        clearAll()
      }
    }, [])
  }

  return { on, emit, clear, clearAll, useOn, useClear, useClearAll }
}

export function useMounter() {
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  return mounted.current
}

export function useOnMount(fn: () => void, delay: number = 0) {
  const m = useRef(false)
  useEffect(() => {
    if (!m.current) {
      m.current = true
      window.setTimeout(() => {
        fn()
      }, delay)
    }
  }, [fn, delay])
}

export function useOnChange(value: any, fn: () => void, runOnInit?: boolean) {
  const mounted = useMounter()
  // eslint-disable-next-line
  useEffect(
    () => {
      if (mounted) {
        fn()
      } else if (!mounted && runOnInit) {
        fn()
      }
    },
    // eslint-disable-next-line
    Array.isArray(value) ? value : [value],
  )
}

const outsideClickCallbacks: Record<string, (e?: any) => void> = {}

export function useOnOutsideClick(
  selector: string,
  active: boolean,
  onClick: () => void,
) {
  useOnMount(() => {
    outsideClickCallbacks[selector] = () => {}
  })

  useOnChange(
    active,
    () => {
      if (!active) {
        document.body.removeEventListener(
          'click',
          outsideClickCallbacks[selector],
        )
      }

      if (active) {
        outsideClickCallbacks[selector] = (e: any) => {
          const elem = document.querySelector(selector)
          if (active && elem && !elem.contains(e.target)) {
            onClick()
          }
        }

        setTimeout(() => {
          document.body.addEventListener(
            'click',
            outsideClickCallbacks[selector],
          )
        }, 20)
      }
    },
    true,
  )
}

export function arrayToObject(data: string[][]): object[] {
  const headers = data[0]; // A primeira linha são os "headers" (campos)
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj: any = {};

    // Mapeia cada valor da linha para o respectivo campo (header)
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });

    result.push(obj);
  }

  return result;
}