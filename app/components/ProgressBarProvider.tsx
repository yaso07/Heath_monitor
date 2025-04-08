'use client'

import NProgress from 'nprogress'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ProgressBarProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.configure({ 
      minimum: 0.3,
      easing: 'ease',
      speed: 500,
      showSpinner: true 
    })

    NProgress.start()
    
    const timer = setTimeout(() => {
      NProgress.done()
    }, 500)

    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [pathname, searchParams])

  // Add NProgress styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: #2563eb;
        position: fixed;
        z-index: 1031;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
      }
      #nprogress .spinner {
        display: block;
        position: fixed;
        z-index: 1031;
        top: 15px;
        right: 15px;
      }
      #nprogress .spinner-icon {
        width: 18px;
        height: 18px;
        box-sizing: border-box;
        border: solid 2px transparent;
        border-top-color: #2563eb;
        border-left-color: #2563eb;
        border-radius: 50%;
        animation: nprogress-spinner 400ms linear infinite;
      }
      @keyframes nprogress-spinner {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
} 