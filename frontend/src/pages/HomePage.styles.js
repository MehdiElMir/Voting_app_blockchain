import styled from "styled-components";
import { Button, Image, Typography } from "antd";

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 1rem;
`;
export const Logo = styled(Image)`
  max-width: 15rem;
  height: auto;
`;
export const Description = styled(Typography)`
  width: 60%;
  text-align: left;
  font-size: 1.4rem;
`;
export const StyledButton = styled(Button)``;
