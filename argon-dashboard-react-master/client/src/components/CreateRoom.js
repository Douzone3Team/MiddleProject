import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';

function CreateRoom() {
  const [ show, setShow ] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return (
    <>  
      <Button variant="primary" onClick={ handleShow } size="sm">방 생성</Button>

      <Modal show={show} onHide={ handleClose }>
        <Modal.Header>
          <Modal.Title>채팅방 만들기</Modal.Title> 
          <i className="ni ni-fat-remove" onClick={ handleClose }></i>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>방 제목</Form.Label>
              <Form.Control type="text" placeholder="Douzone 3팀의 방" autoFocus />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="sm" onClick={ handleClose }>생성</Button>
        </Modal.Footer>
      </Modal>
    </>
  ); 
}

export default CreateRoom