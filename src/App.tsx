import * as React from 'react'
import {useEffect, useRef, useState, useCallback} from 'react'
import {loadContent} from './utils/api'
import {debounce} from './utils/debounce'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

const App: React.FC = () => {
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [perPage, setPerPage] = useState<number>(1)
  const [data, setData] = useState<User[]>([])
  const wrapRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const onScroll = useCallback(
    debounce(async (event: any) => {
      const {scrollHeight, scrollTop, clientHeight} = event.target

      if (event.target) {
        const isEnd = scrollHeight - scrollTop <= clientHeight

        isEnd && setPage(p => p + 1)
      }
    }, 50),
    []
  )

  useEffect(() => {
    setLoading(true)
    loadContent(page).then(res => {
      setTotalPages(res.total_pages)
      setData(d => [...d, ...res.data])
      setPage(res.page)
      setPerPage(res.per_page)
      setLoading(false)
    })
  }, [page])

  useEffect(() => {
    if (wrapRef.current && page >= totalPages) {
      wrapRef.current?.removeEventListener('scroll', onScroll)
    }
  }, [page, onScroll, totalPages])

  useEffect(() => {
    const {current} = wrapRef

    current?.addEventListener('scroll', onScroll)

    return () => {
      current?.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  if (loading && data.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div
      ref={wrapRef}
      style={{height: '100vh', width: '600px', border: '3px solid black', overflow: 'scroll', padding: '5px'}}
    >
      {data.slice(0, perPage * page).map((item, index) => {
        return (
          <div
            key={item.id}
            style={{
              width: '100%',
              // height: '400px',
              border: '1px solid black',
              marginBottom: '10px',
              padding: '5px',
              textAlign: 'center',
              boxSizing: 'border-box',
              position: 'relative'
            }}
          >
            <p style={{width: '60px', height: '60px', position: 'absolute', left: '10px', top: '10px'}}>{index + 1}</p>
            <p>
              <img src={item.avatar} alt={item.avatar} />
            </p>
            <p>{item.email}</p>
            <p>
              {item.first_name} {item.last_name}
            </p>
          </div>
        )
      })}
      {loading && data.length > 0 && <div>Loading...</div>}
    </div>
  )
}

export default App
