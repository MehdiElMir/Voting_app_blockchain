export const Table = (candidates, contract) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Num</th>
          <th>Name</th>
          <th>Manifesto</th>
          <th>Image</th>
          <th>Vote count</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{candidate.name}</td>
            <td>
              <a
                href={`https://coral-useful-wren-606.mypinata.cloud/ipfs/${candidate.manifestoIpfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Manifesto
              </a>
            </td>
            <td>
              <a
                href={`https://coral-useful-wren-606.mypinata.cloud/ipfs/${candidate.imageIpfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://coral-useful-wren-606.mypinata.cloud/ipfs/${candidate.imageIpfsHash}`}
                  alt="Candidate"
                  width="100"
                />
              </a>
            </td>
            <td>{candidate.voteCount}</td>
            <td>
              <button onClick={() => vote(index)}>Vote</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
