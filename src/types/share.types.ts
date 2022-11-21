import { TypePlugin } from "@/types/app.types";

export type PluginShared = { package: string; type: TypePlugin };

export type SharedProject = {
  flavor: string;
  name: string;
  description?: string;
  package?: string;
  plugins: PluginShared[];
  rnPlugins: boolean;
};
