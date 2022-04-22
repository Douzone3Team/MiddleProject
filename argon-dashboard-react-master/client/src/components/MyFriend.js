import React, { useState } from 'react'
import { Modal, Table } from 'react-bootstrap';
import { MdEmojiPeople } from 'react-icons/md' 
import Friend_data from '../views/examples/Friend_data.js'  

function MyFriend() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  // 친구 목록 (Friend_data.js에서 임의 데이터 받아옴)
  const [friend, myFriend] = useState('')  
  
  // console.log(props);
  // console.log(props.friend);

  return (
    <>
      <div onClick={ handleShow } style={{color: 'white'}}>
        친구목록<MdEmojiPeople size={40} color={ 'Yellow '} />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>친구 목록</Modal.Title>
          <i className="ni ni-fat-remove" onClick={ handleClose }></i>
        </Modal.Header>
        <Modal.Body>
          <Table hover>
            <thead> 
              <tr>
                <th>
                  No.
                </th>
                <th>
                  ID
                </th>
                <th>
                  자기소개
                </th>
              </tr>
            </thead>
            <tbody> 
              { 
                Friend_data.map( (data, i) => {
                  return (
                    <>
                      {
                        data.friend === 'Y'
                        ?
                        <tr> 
                          {/* 친구 목록 No. 수정 필요 */}
                          <th scope="row"> { i+1 } </th>
                          <td> { data.user_id } </td>
                          <td> {data.introd} </td> 
                        </tr> 
                        : null
                      }
                    </>
                  )
                })
              }
            </tbody>
          </Table>
        </Modal.Body> 
      </Modal>
    </>
  );
}

export default MyFriend