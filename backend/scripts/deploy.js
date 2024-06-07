async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("owner address" + deployer.address);
  const Voting = await ethers.getContractFactory("Voting");
  const votingDeploy = await Voting.deploy();
  await votingDeploy.deployed();
  console.log(
    "contract deployed with success with address:" + votingDeploy.address
  );
}
main()
  .then(() => {
    process.exit(0);
  })
  .catch((errors) => {
    console.log(errors);
    process.exit(1);
  });
