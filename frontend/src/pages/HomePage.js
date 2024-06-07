import * as S from "./HomePage.styles";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";
import bg from "../assets/bg1.jpg";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <Row>
      <Col span={12}>
        <img
          src={bg}
          style={{ maxHeight: "100vh", width: "100%", objectFit: "cover" }}
        />
      </Col>
      <Col span={12}>
        <S.Main>
          <S.Logo preview={false} src={logo} alt="Logo image"></S.Logo>
          <S.Description>
            <p
              style={{ color: "#2396e6", fontWeight: "bold", fontSize: "2rem" }}
            >
              Ready to have your say?
            </p>
            <ul style={{ listStyle: "none" }}>
              <li style={{ display: "flex", alignItems: "center" }}>
                <IoMdCheckmarkCircleOutline
                  style={{
                    width: "2rem",
                    height: "auto",
                    fill: "#2396e6",
                    marginRight: "1rem",
                  }}
                />{" "}
                <p style={{ margin: 0 }}>Explore our featured candidates</p>
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <IoMdCheckmarkCircleOutline
                  style={{
                    width: "2rem",
                    height: "auto",
                    fill: "#2396e6",
                    marginRight: "1rem",
                  }}
                />{" "}
                <p style={{ margin: 0 }}>learn about their platforms</p>
              </li>
            </ul>
            <p>
              and cast your vote for the individuals you believe will best
              represent your interests.
            </p>
            <p>
              <span
                style={{
                  color: "#2396e6",
                  fontWeight: "bold",
                }}
              >
                Every vote counts
              </span>
              , so don't miss your chance to make an impact!
            </p>
          </S.Description>
          <S.StyledButton type="primary" onClick={() => navigate("/voting")}>
            Ready to vote!
          </S.StyledButton>
        </S.Main>
      </Col>
    </Row>
  );
};
