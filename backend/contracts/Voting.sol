// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Voting {
    struct Candidate {
        string name;
        string manifestoIpfsHash;
        string imageIpfsHash;
        uint voteCount;
    }
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    mapping(address => uint) public votes; // to store votes
    uint public candidatesCount;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner can execute this operation");
        _;
    }

    function addCandidate(string memory _name, string memory _manifestoIpfsHash, 
    string memory _imageIpfsHash) public onlyOwner {
        candidates[candidatesCount] = Candidate(_name, _manifestoIpfsHash, _imageIpfsHash, 0);
        candidatesCount++;
    }

    function vote(uint _candidateNum) public {
        require(!voters[msg.sender], "You have already voted!");
        require(_candidateNum < candidatesCount, "Invalid candidate number!");
        candidates[_candidateNum].voteCount++;
        voters[msg.sender] = true;
        votes[msg.sender] = _candidateNum;
    }

    function getNumberOfCandidates() public view returns (uint) {
        return candidatesCount;
    }

    function getLeadingCandidate() public view returns ( string memory name, uint voteCount,
    string memory imageIpfsHash) {
        uint leadingVoteCount = 0;
        uint leadingCandidateNum = 0;

        for (uint i = 0; i < candidatesCount; i++) {
            if (candidates[i].voteCount > leadingVoteCount) {
                leadingVoteCount = candidates[i].voteCount;
                leadingCandidateNum = i;
            }
        }

        Candidate memory leadingCandidate = candidates[leadingCandidateNum];
        return (leadingCandidate.name, leadingCandidate.voteCount,leadingCandidate.imageIpfsHash);
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getVotedCandidate(address voter) public view returns (string memory name, 
    string memory manifestoIpfsHash, string memory imageIpfsHash) {
        require(voters[voter], "This address has not voted");
        uint candidateNum = votes[voter];
        Candidate memory candidate = candidates[candidateNum];
        return (candidate.name, candidate.manifestoIpfsHash, candidate.imageIpfsHash);
    }
}
