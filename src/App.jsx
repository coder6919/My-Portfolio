// App.jsx
import { InteractionProvider } from "./interactions/InteractionContext";
import Workspace from "./scene/Workspace";
import WorkspaceHUD from "./ui/WorkspaceHUD";
import ActiveModals from "./ui/ActiveModals";

function App() {
  return (
    <InteractionProvider>
      <main className="workspace-app">
        <Workspace />
        <WorkspaceHUD />
        <ActiveModals />
      </main>
    </InteractionProvider>
  );
}

export default App;