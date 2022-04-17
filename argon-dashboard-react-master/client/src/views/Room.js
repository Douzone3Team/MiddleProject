import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  CardTitle,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";
import CreateRoom from "components/CreateRoom.js";


const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [participant, setParticipant] = useState(['참여자1', '참여자2', '참여자3', '참여자4'])

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  return (
    <>
      <Header /> 
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          {
            participant.map(function(a, i) {
              return(
                <>
                  <Col lg="6" xl="3">
                    <Card className="card-stats mb-4 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >{a}</CardTitle>
                            {/* <span className="h2 font-weight-bold mb-0">
                              350,897
                            </span> */}
                          </div>
                          <Col className="col-auto">
                            {/* <div className="icon icon-shape bg-danger text-white rounded-circle shadow"> */}
                              {/* <i className="fas fa-chart-bar" /> */}
                            {/* </div> */}
                          </Col>
                        </Row>
                        <p className="mt-3 mb-0 text-muted text-sm">
                          {/* <span className="text-success mr-2">
                            <i className="fa fa-arrow-up" /> 3.48%
                          </span>{" "} */}
                          {/* <span className="text-nowrap">Since last month</span> */}
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                </>
              )
            })
          } 
        </Row> 
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    {/* <h3 className="mb-0">Page visits</h3> */}
                  </div>
                  <div className="col text-right"> 
                    {/* <CreateRoom/> */}
                  </div>
                </Row>
              </CardHeader>
              {/* <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Page name</th>
                    <th scope="col">Visitors</th>
                    <th scope="col">Unique users</th>
                    <th scope="col">Bounce rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">/argon/</th>
                    <td>4,569</td>
                    <td>340</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/index.html</th>
                    <td>3,985</td>
                    <td>319</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/charts.html</th>
                    <td>3,513</td>
                    <td>294</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      36,49%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/tables.html</th>
                    <td>2,050</td>
                    <td>147</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 50,87%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/profile.html</th>
                    <td>1,795</td>
                    <td>190</td>
                    <td>
                      <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                </tbody>
              </Table> */}
            </Card>
          </Col> 
          <Col className="mb-5 mb-xl-0" xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    {/* <h3 className="mb-0">Page visits</h3> */}
                  </div>
                  <div className="col text-right"> 
                    {/* <CreateRoom/> */}
                  </div>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
