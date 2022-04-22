// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Container,
} from "reactstrap";
import axios from "axios";
import { useState } from "react";
import AuthNavbar from "components/Navbars/AuthNavbar";
import AdminFooter from "components/Footers/AdminFooter.js";
import Header from "components/Headers/Header.js";

const Register = (props) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  const handleInputName = (e) => {
    setName(e.target.value);
  }

  const handleInputId = (e) => {
    setId(e.target.value);
  }

  const handleInputPw = (e) => {
    setPass(e.target.value);
  }

  const handleRegister = async () => {
    console.log("isClicked");

    const url = "/api/register";
    try {
      const data = {
        name: { name },
        id: { id },
        pass: { pass },
      }
      console.log("name:" + name + " id:" + id + " pass:" + pass);
      await axios.post(url, data).then((Response) => {
        const isregit = Response.data;
        console.log("isregit:" + isregit);
        if (isregit) {
          alert("회원가입이 완료되었습니다.");
          props.history.push('/login');
        }
        else {
          alert("이미 가입한 회원입니다.");
        }

      }).catch((ex) => {
        console.log(ex);
      })
    }
    catch (error) {
      console.log(error);
    }

  }


  return (
    <>
      <div className="main-content">
        <AuthNavbar />
        <Header />
        <Container /* style={{ width: "40%", height: "80%", margin: "0 auto" }} */ className="mt--7" fluid>
          <Card style={{ width: "40%", height: "80%", margin: "0 auto" }} className="bg-secondary shadow border-0">
            <br />
            <br />
            <i style={{ margin: "0 auto", fontSize: "150px", paddingBottom: "15px" }} className="ni ni-badge" />
            <h1 style={{ fontSize: "50px", margin: "0 auto" }}>Register</h1>
            <br />
            <br />
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Name" type="text" value={name} onChange={handleInputName} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="ID"
                      type="email"
                      autoComplete="new-email"
                      value={id}
                      onChange={handleInputId}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      value={pass}
                      onChange={handleInputPw}
                    />
                  </InputGroup>
                </FormGroup>
                <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    <span className="text-success font-weight-700">strong</span>
                  </small>
                </div>
                <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <span className="text-muted">
                          I agree with the{" "}
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="button"
                    onClick={handleRegister}
                  >
                    Create account
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Register;
