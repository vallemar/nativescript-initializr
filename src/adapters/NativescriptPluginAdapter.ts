import { Adapter } from "@/adapters/Adapter";
import { Plugin, TypePlugin } from "@/types/app.types";

export class NativeScriptPluginAdapter implements Adapter<Plugin[], Plugin[]> {
  adapt(data: Plugin[]): Plugin[] {
    return data.map((nativeScriptPlugin: Plugin) => {
      nativeScriptPlugin.type = TypePlugin.NS;
      nativeScriptPlugin.package = nativeScriptPlugin.name;
      return nativeScriptPlugin;
    });
  }
}
