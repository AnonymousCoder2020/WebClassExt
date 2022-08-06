import { useCallback, DependencyList, useState } from 'react'

export const useRefWithoutNull = <T extends HTMLElement>(callback: (el: T) => unknown, deps: DependencyList = []) => {
  return useCallback<(el: T | null) => unknown>(elOrNull => {
    elOrNull && callback(elOrNull)
  }, deps)
}

export const useInput = <T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(initialState: string) => {
  const [state, setState] = useState(initialState ?? '')
  const onChange = useCallback(({ target: { value } }: React.ChangeEvent<T>) => setState(value), [])
  return [{ value: state, onChange }, state, setState] as const
}
