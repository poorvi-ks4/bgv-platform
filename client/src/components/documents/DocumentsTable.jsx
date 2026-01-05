export default function DocumentTable({ documents }) {
  return (
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>Document</th>
          <th>Status</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(documents).map(([doc, data]) => (
          <tr key={doc}>
            <td>{doc}</td>
            <td>{data.status}</td>
            <td>{data.comments.join(", ") || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
