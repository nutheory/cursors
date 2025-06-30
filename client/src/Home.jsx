import useWebsocket from 'react-use-websocket'
import { useEffect, useRef } from 'react'
import throttle from 'lodash.throttle'

export function Home({ username }) {


  const WS_URL = 'ws://localhost:3000'
  const {sendJsonMessage } = useWebsocket(WS_URL, {
    queryParams: { username }
  })

  const THROTTLE = 100
  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE))

  useEffect(() => {
    window.addEventListener("mousemove", ev => {
      sendJsonMessageThrottled.current({
        x: ev.clientX,
        y: ev.clientY
      })
    })
  }, [])

  return <h1>Hello, {username}</h1>
}