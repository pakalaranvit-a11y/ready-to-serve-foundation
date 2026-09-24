import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}

// True while the on-screen keyboard is open (visual viewport shrinks well below the layout viewport).
export function useIsKeyboardActive() {
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const onResize = () => setActive(window.innerHeight - vv.height > 150)
    vv.addEventListener("resize", onResize)
    onResize()
    return () => vv.removeEventListener("resize", onResize)
  }, [])

  return active
}