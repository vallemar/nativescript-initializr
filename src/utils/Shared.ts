import { RouteLocationNormalizedLoaded } from "vue-router";
import { Flavor, Plugin, ProjectMetadata, TypePlugin } from "@/types/app.types";
import { PluginShared, SharedProject } from "@/types/share.types";
import { BASE_URL } from "@/constant/constant";
import { pluginService } from "@/services/PluginService";

const SHARE_PARAM = "share";

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
      `?${SHARE_PARAM}=` +
      btoa(
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
      )
    );
  },
  retrieveSharedProject(route: RouteLocationNormalizedLoaded): SharedProject {
    const stringShare = shared.getStringShare(route)!;
    const pluginsInURL = stringShare.getAll("plugin") as [];
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
      flavor: stringShare.get("flavor") as string,
      name: stringShare.get("name") as string,
      description: stringShare.get("description") as string | undefined,
      package: stringShare.get("package") as string | undefined,
      plugins: plugins,
      rnPlugins: (stringShare.get("rnPlugins") as any) == "true",
    };
  },
  isSharedProject(route: RouteLocationNormalizedLoaded): boolean {
    return !!shared.getStringShare(route);
  },
  getStringShare(route: RouteLocationNormalizedLoaded): URLSearchParams | null {
    const shareDataBase64 = route.query[SHARE_PARAM] as string | undefined;
    if (shareDataBase64) {
      const shareData = atob(shareDataBase64) as string;
      const urlParams = new URLSearchParams(shareData);
      if (urlParams.get("flavor") !== null && urlParams.get("name") !== null) {
        return urlParams;
      }
    }
    return null;
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
