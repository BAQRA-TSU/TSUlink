import "./App.css";
import Footer from "./components/Layout/Footer/Footer";
import Header from "./components/Layout/Header/Header";
import Router from "./services/router";

function App() {
  return (
    <div className="main-container">
      <Header />
      <Router />
      <Footer />
    </div>
  );
}

export default App;
