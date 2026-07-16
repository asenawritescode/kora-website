import { Maximize2, Minimize2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function WorkspacePreview() {
  const [open, setOpen] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block max-w-5xl mx-auto overflow-hidden rounded-sm border border-[#333] bg-black shadow-2xl text-left"
        aria-label="Open larger Kora workspace preview"
      >
        <img
          src="/workspace-preview.png"
          alt="Kora workspace dashboard showing modules, workspace search, and task cards"
          className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-sm bg-black/80 px-3 py-2 text-[10px] font-medium text-white uppercase tracking-wider font-mono opacity-95 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" />
          Tap to zoom
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Kora workspace image viewer"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              setZoomed(false)
            }}
            className="fixed right-4 top-4 z-[101] inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#333] bg-black text-white hover:bg-[#313030] transition-colors"
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomed((current) => !current)}
            className="fixed left-4 top-4 z-[101] inline-flex items-center gap-2 rounded-sm border border-[#333] bg-black px-4 py-3 text-xs font-medium text-white hover:bg-[#313030] transition-colors font-mono"
            aria-label={zoomed ? 'Fit image to screen' : 'Zoom image'}
          >
            {zoomed ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {zoomed ? 'Fit' : 'Zoom'}
          </button>
          <div className="h-full w-full overflow-auto">
            <div className={`flex min-h-full ${zoomed ? 'items-start justify-start pt-16' : 'items-center justify-center'}`}>
              <img
                src="/workspace-preview.png"
                alt="Kora workspace dashboard showing modules, workspace search, and task cards"
                className={`h-auto rounded-sm border border-[#333] ${
                  zoomed
                    ? 'max-w-none w-[1200px] md:w-[1800px]'
                    : 'max-h-[calc(100vh-5rem)] w-full max-w-[1800px] object-contain'
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
