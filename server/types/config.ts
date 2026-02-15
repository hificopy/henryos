export interface OpenClawConfig {
  meta: { lastTouchedVersion: string; lastTouchedAt: string };
  agents: {
    defaults: any;
    list: any[];
  };
  models: {
    providers: Record<string, any>;
  };
  gateway: {
    port: number;
    mode: string;
    auth: { mode: string; token: string };
  };
}
