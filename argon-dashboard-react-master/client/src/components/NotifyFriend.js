import React from 'react'
import { Toast } from 'reactstrap'

function NotifyFriend() {
  return (
    <>
      <Toast>
        <ToastHeader icon={<Spinner size="sm">Loading...</Spinner>}>
          Reactstrap
        </ToastHeader>
        <ToastBody>
          This is a toast with a custom icon — check it out!
        </ToastBody>
      </Toast> 
    </>
  )
}

export default NotifyFriend