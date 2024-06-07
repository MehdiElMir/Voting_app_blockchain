import styled from "styled-components";

export const StyledTable = styled.table`
  width: 100%;
  text-align: center;
  font-size: 1.6rem;
  font-weight: 100;
  color: white;
  border: 1px solid #2396e6;
  border: 4px solid #2396e6;
  border-collapse: collapse;
  border-radius: 20%;
`;

export const styledTH = styled.th`
  &:not(:first-child) {
    height: 4rem;
    background-color: #2396e6;
    width: 30%;
    color: white;
    padding: 1rem;
  }

  &:first-child {
    height: 4rem;
    background-color: #2396e6;
    width: 10%;
    color: white;
    padding: 1rem;
  }

  &::not(:last-child) {
    text-align: start;
    border-right: 2px solid white;
  }
`;

export const StyledTR = styled.tr`
  margin-bottom: 2rem;
  color: black;
  background-color: white;

  &:hover {
    background-color: #d6d6d6;
  }

  &:nth-child(odd) {
    background-color: #f3f3f3;
  }
  &:nth-child(odd):hover {
    background-color: #d6d6d6;
  }
`;

export const StyledTD = styled.td`
  &:not(:first-child) {
    width: 30%;
  }

  &:first-child {
    width: 10%;
  }
  &:not(:last-child) {
    border-right: 2px solid #2396e6;
  }
`;
