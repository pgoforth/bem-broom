import "../shared/tokens.css";
import "../shared/app.css";

import { Badge } from "./components/Badge.jsx";
import { Card } from "./components/Card.jsx";
import { Title } from "./components/Title.jsx";
import { useBem } from "@bem-broom/react";
import { useState } from "react";

export const BbApp = () => {
  const [mode, setMode] = useState("light");
  const className = useBem("app", {mode});
  return (
    <div className={className}>
        <Badge
            tone="info"
            clickable
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
        >
            Switch to {mode === "light" ? "Dark " : "Light"} Mode
        </Badge>
        <hr />
        <Card active>
            <Title variant="h2">Hello from React</Title>
            <Badge tone="success">New</Badge>
        </Card>
    </div>
  );
};
