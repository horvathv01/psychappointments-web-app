import React, {useState, useEffect, useContext} from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import ServerURLAndPort from "../ServerURLAndPort";


export default function LoginPage(){
    const {user, login, logout, retreiveUser} = useContext(UserContext);

    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLoginTest = ()  => {

      const psych1 = {
        name: "Psychologist1",
        type: "Psychologist",
        id: 1,
        email: "csirke@pulyka.ru",
        phone: "+361/123-4567",
        dateOfBirth: "1994-07-24",
        address: {
          country: "Hungary",
          zip: "1196",
          city: "Budapest",
          street: "Petőfi utca",
          rest: "134/b"
      }
      }

      const client1 = {
        name: "Client1",
        type: "Client",
        id: 2,
        email: "csirke@pulyka.ru",
        phone: "+361/123-4567",
        dateOfBirth: "1994-07-24",
        address: {
          country: "Hungary",
          zip: "1196",
          city: "Budapest",
          street: "Petőfi utca",
          rest: "134/b"
      }
      }

      const manager1 = {
        name: "Manager1",
        type: "Manager",
        id: 3,
        email: "csirke@pulyka.ru",
        phone: "+361/123-4567",
        dateOfBirth: "1994-07-24",
        address: {
          country: "Hungary",
          zip: "1196",
          city: "Budapest",
          street: "Petőfi utca",
          rest: "134/b"
      }
      }

      const admin1 = {
        name: "Admin1",
        type: "Admin",
        id: 4,
        email: "csirke@pulyka.ru",
        phone: "+361/123-4567",
        dateOfBirth: "1994-07-24",
        address: {
          country: "Hungary",
          zip: "1196",
          city: "Budapest",
          street: "Petőfi utca",
          rest: "134/b"
      }
      }

      login(admin);
      navigate("/");
    };

    const handleLogin = async () => {
      if(userEmail == "" || password == ""){
        window.alert("Please input credentials!");
        return;
      }
        const credentialsParsed = btoa(`${userEmail}:${password}`);
        //fetch data based on userEmail and password
        fetch(`${ServerURLAndPort.host}://${ServerURLAndPort.url}:${ServerURLAndPort.port}/access/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: credentialsParsed,
            },
            credentials: 'include',
          })
          .then((response) => {
            if(response.ok){
                return response.json();
            } else {
                setUserEmail("");
                setPassword("");
                window.alert("Invalid email or password!");
            }
          })
          .then(data => {
            login(data);
            retreiveUser();
            navigate("/");
          });
    };

    const handleRegister = () => {
        navigate("/registration");
    };

    return(
        <div>
      <div className="m-3 text-center">
        <Form>
          <Row className="mb-3 justify-content-center">
            <Col xs={8} sm={6} md={4} lg={3}>
              <Form.Group controlId="formGridName">
                <Form.Label>User email</Form.Label>
                <Form.Control
                  type="text"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3 justify-content-center">
            <Col xs={8} sm={6} md={4} lg={3}>
              <Form.Group controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3 justify-content-center">
            <Col xs={12} sm={12} className="text-center mb-3">
              <Button variant="primary" onClick={handleLogin} className="m-2">
                Login
              </Button>
              <Button variant="secondary" onClick={handleRegister}>
                Registration
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
    )
}