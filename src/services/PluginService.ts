import { Plugin, TypePlugin } from "@/types/app.types";
import { ReactNativePluginAdapter } from "@/adapters/ReactNativePluginAdapter";
import { NativeScriptPluginAdapter } from "@/adapters/NativescriptPluginAdapter";

const reactNativePluginAdapter = new ReactNativePluginAdapter();
const nativeScriptPluginAdapter = new NativeScriptPluginAdapter();

export const pluginService = {
  async findAll() {
    return nativeScriptPluginAdapter.adapt(
      await (
        await fetch("https://market.nativescript.org/api/plugins.json")
      ).json()
    );
  },
  async searchPluginReactNative(query: string): Promise<Plugin[]> {
    return reactNativePluginAdapter.adapt(
      await (
        await fetch(
          "https://reactnative.directory/api/libraries?search=" + query
        )
      ).json()
    );
  },
};
