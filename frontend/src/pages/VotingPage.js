import { useEffect, useState } from "react";
import Voting from "../Voting.json";
import { ethers } from "ethers";
import axios from "axios";
import { Button, Card, Col, Drawer, Image, Input, Row, Typography } from "antd";
import { IoIosPersonAdd } from "react-icons/io";
import { LuHome } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaRegFileAlt } from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import * as S from "./VotingPage.styles";
import { FaPeopleGroup } from "react-icons/fa6";
import { TbPlugConnected } from "react-icons/tb";
import { TiStarFullOutline } from "react-icons/ti";
import { Toaster, toast } from "sonner";
import "react-toastify/dist/ReactToastify.css";

const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VotingPage() {
  const [candidates, setCandidates] = useState([]);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [numberCandidates, setNumberCandidates] = useState(0);
  const [candidateName, setCandidateName] = useState("");
  const [manifestoFile, setManifestoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [owner, setOwner] = useState(null);
  const [open, setOpen] = useState(false);
  const [leadingCandidate, setLeadingCandidate] = useState(null);

  const navigate = useNavigate();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    init();
  }, []);

  async function loadCandidates(contract) {
    try {
      const candidatesCount = await contract.candidatesCount();
      const candidateArray = [];
      for (let i = 0; i < candidatesCount; i++) {
        const candidate = await contract.candidates(i);
        candidateArray.push({
          name: candidate.name,
          manifestoIpfsHash: candidate.manifestoIpfsHash,
          imageIpfsHash: candidate.imageIpfsHash,
          voteCount: candidate.voteCount.toString(),
        });
      }
      setCandidates(candidateArray);
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
  }

  async function loadLeadingCandidate(contract) {
    try {
      const [leadingName, leadingVoteCount, leadingImage] =
        await contract.getLeadingCandidate();

      const leadingCandidate = {
        name: leadingName,

        voteCount: leadingVoteCount.toString(),
        imageIpfsHash: leadingImage,
      };
      console.log(leadingCandidate);
      setLeadingCandidate(leadingCandidate);
    } catch (error) {
      console.error("Error loading leading candidate:", error);
    }
  }

  async function init() {
    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          ContractAddress,
          Voting.abi,
          signer
        );
        const account = await signer.getAddress();
        const owner = await contract.getOwner();
        const nbrCadidates = await contract.getNumberOfCandidates();
        const bigNumber = ethers.BigNumber.from(nbrCadidates._hex);
        const number = bigNumber.toNumber();
        setAccount(account);
        setSigner(signer);
        setProvider(provider);
        setContract(contract);
        setNumberCandidates(number);
        setOwner(owner);
        await loadCandidates(contract);
        await loadLeadingCandidate(contract);
      }
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  }

  async function vote(candidateIndex) {
    if (contract) {
      try {
        const tx = await contract.vote(candidateIndex);
        await tx.wait();
        await loadCandidates(contract); // Refresh the candidates list after voting
        await loadLeadingCandidate(contract); // Refresh the leading candidate after voting
        toast.success("Your vote has been added sucessfully");
      } catch (error) {
        if (
          error.data &&
          error.data.message &&
          error.data.message.includes(
            "reverted with reason string 'You have already voted!'"
          )
        ) {
          // Fetch the candidate the user has already voted for
          try {
            const votedCandidateIndex = await contract.votes(account);
            const candidate = await contract.candidates(votedCandidateIndex);
            const candidateName = candidate.name;
            toast.error(`You have already voted for ${candidateName}`);
          } catch (fetchError) {
            console.error("Error fetching voted candidate:", fetchError);
            toast.error("You have already voted");
          }
        } else {
          console.error("An unexpected error occurred:", error);
          toast.error("An unexpected error occurred");
        }
      }
    }
  }

  async function addCandidate() {
    if (contract && manifestoFile && imageFile) {
      try {
        // Upload manifesto file to Pinata
        const manifestoFormData = new FormData();
        manifestoFormData.append("file", manifestoFile);
        const manifestoResponse = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          manifestoFormData,
          {
            maxBodyLength: "Infinity",
            headers: {
              "Content-Type": `multipart/form-data; boundary=${manifestoFormData._boundary}`,
              pinata_api_key: "ea697e44713a6454ce47", // Replace with your actual Pinata API key
              pinata_secret_api_key:
                "2477f9a42d7c0c4c7ca7ad305f26dcbb93f332040e4a83a3f6e5aba8ec43ac27", // Replace with your actual Pinata secret API key
            },
          }
        );
        const manifestoIpfsHash = manifestoResponse.data.IpfsHash;

        // Upload image file to Pinata
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        const imageResponse = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          imageFormData,
          {
            maxBodyLength: "Infinity",
            headers: {
              "Content-Type": `multipart/form-data; boundary=${imageFormData._boundary}`,
              pinata_api_key: "ea697e44713a6454ce47", // Replace with your actual Pinata API key
              pinata_secret_api_key:
                "2477f9a42d7c0c4c7ca7ad305f26dcbb93f332040e4a83a3f6e5aba8ec43ac27", // Replace with your actual Pinata secret API key
            },
          }
        );
        const imageIpfsHash = imageResponse.data.IpfsHash;

        const tx = await contract.addCandidate(
          candidateName,
          manifestoIpfsHash,
          imageIpfsHash
        );
        await tx.wait();
        await loadCandidates(contract);
        const nbrCadidates = await contract.getNumberOfCandidates();
        const bigNumber = ethers.BigNumber.from(nbrCadidates._hex);
        const number = bigNumber.toNumber();
        setNumberCandidates(number);
        await loadLeadingCandidate(contract);

        setOpen(false);
      } catch (error) {
        console.error("Add candidate failed:", error);
      }
    }
  }

  function handleFileChange(event, setFile) {
    setFile(event.target.files[0]);
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        padding: "2rem",
        position: "relative",
        backgroundColor: "linear-gradient(#2396e6, ##0d4ab5)",
      }}
    >
      <Row justify={"end"} style={{ width: "100%" }}>
        {account && account === owner && (
          <Button
            type="primary"
            style={{
              borderRadius: "50%",
              boxShadow:
                "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
              width: "6rem",
              height: "6rem",
            }}
            onClick={showDrawer}
          >
            <IoIosPersonAdd style={{ width: "3rem", height: "auto" }} />
          </Button>
        )}
        <Button
          type="primary"
          style={{
            borderRadius: "50%",
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            width: "6rem",
            height: "6rem",
            marginBottom: "1rem",
            marginLeft: "1rem",
          }}
          onClick={() => navigate("/")}
        >
          <LuHome style={{ width: "3rem", height: "auto" }} />
        </Button>
      </Row>
      <Row gutter={16} justify={"space-between"}>
        <Col span={16}>
          {account ? (
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>Candidates List</p>
                  <FaRegFileAlt
                    style={{
                      width: "1.5rem",
                      height: "auto",
                      fill: "#2396e6",
                      marginLeft: "5px",
                    }}
                  />
                </div>
              }
              style={{
                width: "100%",
                height: "calc(100vh - 13rem)",
                overflowY: "scroll",
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              }}
            >
              <S.StyledTable>
                <thead>
                  <S.StyledTR>
                    <S.styledTH>Num</S.styledTH>
                    <S.styledTH>Image</S.styledTH>
                    <S.styledTH>Name</S.styledTH>
                    <S.styledTH>Manifesto</S.styledTH>

                    <S.styledTH>Vote count</S.styledTH>
                    <S.styledTH>Action</S.styledTH>
                  </S.StyledTR>
                </thead>
                <tbody>
                  {candidates.map((candidate, index) => (
                    <S.StyledTR key={index}>
                      <S.StyledTD>{index + 1}</S.StyledTD>
                      <S.StyledTD>
                        <Image
                          src={`https://coral-useful-wren-606.mypinata.cloud/ipfs/${candidate.imageIpfsHash}`}
                          alt="Candidate"
                          width="100"
                          style={{
                            marginTop: "1rem",
                            marginBottom: "1rem",
                            width: "6rem",
                            height: "6rem",
                            objectFit: "cover",
                            borderRadius: "50%",
                            border: "2px solid #2396e6",
                          }}
                        />
                      </S.StyledTD>
                      <S.StyledTD>{candidate.name}</S.StyledTD>
                      <S.StyledTD>
                        <a
                          href={`https://coral-useful-wren-606.mypinata.cloud/ipfs/${candidate.manifestoIpfsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            textDecoration: "underline",
                            color: "#2396e6",
                          }}
                        >
                          Read manifesto <FaLink />
                        </a>
                      </S.StyledTD>

                      <S.StyledTD>
                        <p
                          style={{
                            fontSize: "2rem",
                            fontWeight: "bold",
                            color: "#2396e6",
                          }}
                        >
                          {candidate.voteCount}
                        </p>
                      </S.StyledTD>
                      <S.StyledTD>
                        <Button type="primary" onClick={() => vote(index)}>
                          <MdHowToVote
                            style={{ width: "2rem", height: "auto" }}
                          />
                        </Button>
                      </S.StyledTD>
                    </S.StyledTR>
                  ))}
                </tbody>
              </S.StyledTable>
            </Card>
          ) : (
            <Card
              style={{
                height: "13rem",
                width: "100%",
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              }}
            >
              <p>
                Connect your MetaMask wallet to participate in the voting
                process.{" "}
              </p>
              <p>
                If you don't have MetaMask installed, you can download it{" "}
                <a
                  href="https://metamask.io/download.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here <FaLink />
                </a>
              </p>
            </Card>
          )}
        </Col>
        <Col span={8}>
          <Card
            title={
              account ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>Connected Account </p>
                  <IoMdCheckmarkCircleOutline
                    style={{
                      width: "1.5rem",
                      height: "auto",
                      fill: "#1ed760",
                      marginLeft: "5px",
                    }}
                  />
                  {account && account == owner && (
                    <span>
                      {"  ("}admin{")"}
                    </span>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>Not Connected</p>
                  <TbPlugConnected
                    style={{
                      width: "1.5rem",
                      height: "auto",
                      fill: "#ff2172",
                      marginLeft: "5px",
                    }}
                  />
                </div>
              )
            }
            style={{
              height: "13rem",
              width: "100%",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
            }}
          >
            <p>{account}</p>
          </Card>
          {account && (
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>Number of candidates</p>
                  <FaPeopleGroup
                    style={{
                      width: "1.5rem",
                      height: "auto",
                      fill: "#1ed760",
                      marginLeft: "5px",
                    }}
                  />
                </div>
              }
              style={{
                width: "100%",
                marginTop: "2rem",
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              }}
            >
              <p
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#2396e6",
                }}
              >
                {numberCandidates}
              </p>
            </Card>
          )}
          {leadingCandidate && leadingCandidate.voteCount > 0 && (
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>Leading Candidate</p>
                  <TiStarFullOutline
                    style={{
                      width: "1.5rem",
                      height: "auto",
                      fill: "#1ed760",
                      marginLeft: "5px",
                    }}
                  />
                </div>
              }
              style={{
                width: "100%",
                marginTop: "2rem",
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Image
                  src={`https://coral-useful-wren-606.mypinata.cloud/ipfs/${leadingCandidate.imageIpfsHash}`}
                  alt="Candidate"
                  width="100"
                  style={{
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    width: "4rem",
                    height: "4rem",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #2396e6",
                  }}
                />
                <Typography.Text>{leadingCandidate.name}</Typography.Text>
                <Typography.Text>
                  Votes: {leadingCandidate.voteCount}
                </Typography.Text>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      <Drawer
        placement="bottom"
        closable={false}
        onClose={onClose}
        open={open}
        key={"bottom"}
        height={300}
      >
        <Row justify={"center"}>
          <div style={{ width: "50%" }}>
            <Typography style={{ marginTop: 0, marginBottom: "1rem" }}>
              Candidate Name
            </Typography>
            <Input
              type="text"
              placeholder="Candidate Name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
            <Typography style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              Image
            </Typography>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setImageFile)}
              placeholder="Upload Image"
            />
            <Typography style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              Manifesto
            </Typography>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setManifestoFile)}
              placeholder="Upload Manifesto"
            />
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type={"primary"} onClick={addCandidate}>
              Add Candidate
            </Button>
          </div>
        </Row>
      </Drawer>
      <Toaster richColors />
    </div>
  );
}

export default VotingPage;
