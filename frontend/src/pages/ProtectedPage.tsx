import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedPage = () => {
  const { user } = useAuth();
  return (
    <main>
      <Link className="home-link" to="/">
        ◄ Home
      </Link>
      <section className="main-container">
        <h1 className="header-text">This is a Protected Page</h1>
        <p>Current User : {user?.email || "None"}</p>
      </section>
    </main>
  );
};

export default ProtectedPage;
