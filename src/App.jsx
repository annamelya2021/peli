// App.js
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppContent } from "./AppContent";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
