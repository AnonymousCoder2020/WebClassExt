import { PropsWithChildren, useMemo, useState } from 'react'
import { useRefWithoutNull } from '~lib/hooks'

export const ResponsiveImg = ({ children }: PropsWithChildren<{}>) => {
  const [aspect, setAspect] = useState<number>(0)
  const aspectCSS = useMemo(() => ({ paddingTop: `${aspect * 100}%` }), [aspect])
  const onRef = useRefWithoutNull(
    helper => {
      const img = helper.querySelector('img')
      if (!img) return
      setAspect(img.naturalHeight / img.naturalWidth)
    },
    [children]
  )
  return (
    <div className='aspect-wrapper'>
      <div className='aspect-helper' style={aspectCSS} ref={onRef}>
        {children}
      </div>
    </div>
  )
}
