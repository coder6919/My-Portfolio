// App.jsx
import { InteractionProvider } from "./interactions/InteractionContext";
import Workspace from "./scene/Workspace";
import WorkspaceHUD from "./ui/WorkspaceHUD";
import ActiveModals from "./ui/ActiveModals";
import HoverLabel from "./ui/HoverLabel";

function App() {
  return (
    <InteractionProvider>
      <main className="workspace-app">
        <Workspace />
        <HoverLabel />
        <WorkspaceHUD />
        <ActiveModals />
      </main>
    </InteractionProvider>
  );
}

export default App;