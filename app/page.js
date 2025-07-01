import Container from '@mui/material/Container';
import App from "../components/App";


export default function HomePage() {
  console.log("test");
  return (
    <>
      <Container>
        <h1>Welcome to Next.js App Router</h1>;
        <App />
      </Container>
    </>
  );
}
