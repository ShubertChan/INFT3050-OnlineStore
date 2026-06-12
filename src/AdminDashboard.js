import React, { useState } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import Header from './Header';

const AdminDashboard = () => {
  const [show, setShow] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState('');

  // 模拟从数据库获取的用户数据 (之后会通过 Node.js API 真实获取)
  const [users, setUsers] = useState([
    { id: 1, name: 'Jane Citizen', email: 'jane.l.j.citizen@somemail.com', address: '221 Ring Road', postcode: '2308', state: 'NSW' },
    { id: 2, name: 'Virginia Woolf', email: 'virginia.woolf@hotmail.com', address: '3 Toad Harbor', postcode: '1405', state: 'NSW' }
  ]);

  const handleClose = () => setShow(false);
  
  // 点击编辑按钮，打开弹窗
  const handleShow = (user) => {
    setEditUser(user);
    setError('');
    setShow(true);
  };

  // 核心：表单提交与数据验证 (对应你的 Physical Address Data Validation 任务)
  const handleSave = (e) => {
    e.preventDefault();
    
    // 强制规则 1：地址必须同时包含字母和数字
    const addressRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\s]+$/;
    if (!addressRegex.test(editUser.address)) {
      setError('Address Line MUST contain both letters and numbers.');
      return;
    }

    // 强制规则 2：邮编必须是纯数字 (例如 4 位数)
    const postcodeRegex = /^\d+$/;
    if (!postcodeRegex.test(editUser.postcode)) {
      setError('Post Code MUST contain numbers only.');
      return;
    }

    // 强制规则 3：州必须下拉选择
    if (!editUser.state) {
      setError('Please select a State from the dropdown.');
      return;
    }

    // 未来这里会调用后端 API：fetch('http://localhost:5000/api/users/update', {...})
    alert('User successfully updated! Validations passed.');
    setShow(false);
  };

  return (
    <div className="page-wrapper">
      <Header />
      <Container className="mt-5">
        <Row>
            <Col>
                <h2 className="mb-4">Admin Dashboard - User Management</h2>
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Postcode</th>
                      <th>State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.address}</td>
                        <td>{u.postcode}</td>
                        <td>{u.state}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => handleShow(u)}>Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
            </Col>
        </Row>
      </Container>

      {/* 修改信息的弹窗 Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {editUser && (
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" value={editUser.name} onChange={(e) => setEditUser({...editUser, name: e.target.value})} />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Street Address</Form.Label>
                <Form.Control type="text" value={editUser.address} onChange={(e) => setEditUser({...editUser, address: e.target.value})} />
                <Form.Text className="text-muted">Must contain both letters and numbers.</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Post Code</Form.Label>
                <Form.Control type="text" value={editUser.postcode} onChange={(e) => setEditUser({...editUser, postcode: e.target.value})} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Select value={editUser.state} onChange={(e) => setEditUser({...editUser, state: e.target.value})}>
                  <option value="">Select State...</option>
                  <option value="NSW">New South Wales (NSW)</option>
                  <option value="VIC">Victoria (VIC)</option>
                  <option value="QLD">Queensland (QLD)</option>
                  <option value="WA">Western Australia (WA)</option>
                  <option value="SA">South Australia (SA)</option>
                  <option value="TAS">Tasmania (TAS)</option>
                </Form.Select>
              </Form.Group>

              <Button variant="dark" type="submit" className="w-100 mt-3">
                Update User
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;