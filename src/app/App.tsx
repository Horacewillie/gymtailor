import styles from "./App.module.css";
import { CreateAccountPage } from "../pages/create-account/CreateAccountPage";

export function App() {
  return (
    <div className={styles.appShell}>
      <CreateAccountPage />
    </div>
  );
}
