import { Adapter } from "@/adapters/Adapter";
import {
  RequestReactNativePluginDTO,
  Plugin,
  ReactNativePlugin,
  TypePlugin,
} from "@/types/app.types";

export class ReactNativePluginAdapter
  implements Adapter<RequestReactNativePluginDTO, Plugin[]>
{
  adapt(data: RequestReactNativePluginDTO): Plugin[] {
    return data.libraries.map((reactNativePlugin: ReactNativePlugin) => {
      return {
        type: TypePlugin.RN,
        name: reactNativePlugin.github.name,
        package: reactNativePlugin.npmPkg,
        version: this.getVersion(reactNativePlugin),
        description: reactNativePlugin.github.description,
        date: reactNativePlugin.github.stats.updatedAt,
        links: {
          npm: undefined,
          repository: reactNativePlugin.githubUrl,
        },
        downloadStats: {
          lastDay: 0,
          lastWeek: 0,
          lastMonth: reactNativePlugin.npm.downloads,
        },
        author: {
          name: "",
          username: "",
        },
      } as Plugin;
    });
  }

  private getVersion(reactNativePlugin: ReactNativePlugin) {
    return reactNativePlugin.github.lastRelease
      ? reactNativePlugin.github.lastRelease.tagName.replace("v", "")
      : "latest";
  }
}
