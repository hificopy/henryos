export interface Agent {
  id: string;
  name: string;
  model: {
    primary: string;
    fallbacks: string[];
  };
  workspace: string;
  tools: {
    profile?: string;
    allow: string[];
  };
}
