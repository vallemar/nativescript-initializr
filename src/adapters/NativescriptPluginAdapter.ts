import { Adapter } from "@/adapters/Adapter";
import {
  RequestReactNativePluginDTO,
  Plugin,
  ReactNativePlugin,
  TypePlugin,
} from "@/types/app.types";

export class NativeScriptPluginAdapter implements Adapter<Plugin[], Plugin[]> {
  adapt(data: Plugin[]): Plugin[] {
    return data.map((nativeScriptPlugin: Plugin) => {
      nativeScriptPlugin.type = TypePlugin.NS;
      nativeScriptPlugin.package = nativeScriptPlugin.name;
      return nativeScriptPlugin;
    });
  }

  private getVersion(reactNativePlugin: ReactNativePlugin) {
    return reactNativePlugin.github.lastRelease
      ? reactNativePlugin.github.lastRelease.tagName.replace("v", "")
      : "latest";
  }
}
