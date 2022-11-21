import { RouteLocationNormalizedLoaded } from "vue-router";
import { Flavor, Plugin, ProjectMetadata, TypePlugin } from "@/types/app.types";
import { PluginShared, SharedProject } from "@/types/share.types";
import { BASE_URL } from "@/constant/constant";
import { pluginService } from "@/services/PluginService";

export const shared = {
  exportShared(
    flavor: Flavor,
    projectMetadata: ProjectMetadata,
    plugins: Plugin[],
    activeRNPlugins: boolean
  ): SharedProject {
    return {
      flavor: flavor.text,
      name: projectMetadata.name,
      description: projectMetadata.description,
      package: projectMetadata.package,
      rnPlugins: activeRNPlugins,
      plugins: plugins.map<PluginShared>((plugin) => ({
        package: plugin.package,
        type: plugin.type,
      })),
    };
  },
  buildURL(
    flavor: Flavor,
    projectMetadata: ProjectMetadata,
    plugins: Plugin[],
    activeRNPlugins: boolean
  ): string {
    const sharedData = shared.exportShared(
      flavor,
      projectMetadata,
      plugins,
      activeRNPlugins
    );
    return (
      BASE_URL +
      "?" +
      new URLSearchParams({
        flavor: sharedData.flavor,
        name: sharedData.name,
        description: sharedData.description || "",
        package: sharedData.package || "",
        rnPlugins: activeRNPlugins.toString(),
      }).toString() +
      (plugins.length === 0
        ? ""
        : "&plugin=" +
          sharedData.plugins
            .map((plugin) =>
              JSON.stringify({ package: plugin.package, type: plugin.type })
            )
            .join("&plugin="))
    );
  },
  retrieveSharedProject(route: RouteLocationNormalizedLoaded): SharedProject {
    const pluginsInURL = route.query["plugin"] as [];
    const plugins: PluginShared[] = [];
    if (pluginsInURL) {
      if (Array.isArray(pluginsInURL)) {
        const pluginJSON = pluginsInURL.map(
          (plugin: any) => JSON.parse(plugin) as PluginShared
        );
        plugins.push(...pluginJSON);
      } else {
        plugins.push(JSON.parse(pluginsInURL));
      }
    }

    return {
      flavor: route.query["flavor"] as string,
      name: route.query["name"] as string,
      description: route.query["description"] as string | undefined,
      package: route.query["package"] as string | undefined,
      plugins: plugins,
      rnPlugins: (route.query["rnPlugins"] as any) == "true",
    };
  },
  isSharedProject(route: RouteLocationNormalizedLoaded): boolean {
    return (
      route.query["flavor"] !== undefined && route.query["name"] !== undefined
    );
  },
  resolvePlugins(
    route: RouteLocationNormalizedLoaded,
    pluginsNS: Plugin[]
  ): Promise<Plugin[]> {
    const shareData = shared.retrieveSharedProject(route);
    const callsRnAPI: any[] = [];
    const pluginsResolve: Plugin[] = [];
    return new Promise((resolve) => {
      shareData.plugins.forEach((pluginShared) => {
        if (pluginShared.type === TypePlugin.NS) {
          const plugin = pluginsNS.find(
            (plugin) => plugin.package === pluginShared.package
          );
          if (plugin) {
            pluginsResolve.push(plugin);
          }
        } else if (pluginShared.type === TypePlugin.RN) {
          callsRnAPI.push({
            call: pluginService.searchPluginReactNative(pluginShared.package),
            package: pluginShared.package,
          });
        }
      });
      Promise.all(callsRnAPI.map((x) => x.call)).then(
        (callsReactNativePlugins: any[]) => {
          callsRnAPI
            .map((x) => x.package)
            .forEach((packageRn: string, index) => {
              const rnPlugins: Plugin[] = callsReactNativePlugins[index];
              const plugin = rnPlugins.find(
                (plugin) => plugin.package === packageRn
              );
              if (plugin) {
                pluginsResolve.push(plugin);
              }
            });
          resolve(pluginsResolve);
        }
      );
    });
  },
};
