import { Flavor, Plugin, ProjectMetadata } from "@/types/app.types";
import JSZip from "jszip";
import { Octokit } from "@octokit/core";
import { PROJECT_DEFINITION } from "@/constant/constant";

enum TypeItemRepository {
  TREE = "tree",
  BLOB = "blob",
}
type ItemRepository = {
  mode: string;
  path: string;
  sha: string;
  size: number;
  type: TypeItemRepository;
  url: string;
  file?: string | Blob;
  repositoryPath: RepositoryPath;
};
type PackageJSON = {
  name: string;
  description: string;
  dependencies: { [key: string]: string };
  devDependencies: { [key: string]: string };
};
type RepositoryPath = {
  owner: string;
  repo: string;
};
const nativescriptTemplateRepository: RepositoryPath = {
  owner: "NativeScript",
  repo: "nativescript-app-templates",
};
const nativescriptTemplateConfigRepository: RepositoryPath = {
  //TODO: Change when nativescript.config.ts file template is in a repository
  owner: "NativeScript",
  repo: "nativescript-app-templates",
};
const BLOB_EXTENSIONS = ["svg", "png", "ico", "jpeg", "jpg", "ttf"];
const accessToken = "";

export class DownloadProjectService {
  async download(
    link: HTMLAnchorElement,
    flavor: Flavor,
    projectDefinition: ProjectMetadata,
    plugins: Plugin[]
  ) {
    if (!projectDefinition.name) {
      projectDefinition.name = PROJECT_DEFINITION.name;
    }
    const itemsPath = await this.getTreeRepository(flavor);
    const items = await this.downloadTreeFiles(itemsPath);
    this.applyPluginsAndMetadata(items, flavor, plugins, projectDefinition);
    if (projectDefinition.package) {
      this.addNativescriptConfigFile(items, projectDefinition, flavor);
    }
    if (plugins.find((plugin) => plugin.name === "@open-native/core")) {
      this.addWebpackOpenNativeFile(items, flavor);
    }
    const zip = this.buildZip(items, flavor, projectDefinition);
    this.downloadUser(link, zip);
  }

  private buildZip(
    files: ItemRepository[],
    flavor: Flavor,
    projectDefinition: ProjectMetadata
  ): JSZip {
    const zip = new JSZip();
    const projectName = projectDefinition.name.trim().replace(" ", "-");
    zip.folder(projectName);

    files.forEach((item) => {
      const pathItem = `${projectName}/${this.getAbsolutePath(
        item.path,
        flavor
      )}`;
      if (
        item.type === TypeItemRepository.TREE &&
        item.path !== flavor.repositoryPath
      ) {
        zip.file(pathItem, null, {
          dir: true,
        });
      } else if (item.type === TypeItemRepository.BLOB)
        zip.file(pathItem, item.file);
    });
    return zip;
  }

  private getAbsolutePath(path: string, flavor: Flavor) {
    return path.replace(flavor.repositoryPath + "/", "");
  }
  private getFileExtension(path: string) {
    const extensions = path.split(".");
    return extensions[extensions.length - 1];
  }
  private async getTreeRepository(flavor: Flavor): Promise<ItemRepository[]> {
    const octokit = new Octokit({
      auth: accessToken,
    });

    const result = await octokit.request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1",
      {
        owner: nativescriptTemplateRepository.owner,
        repo: nativescriptTemplateRepository.repo,
        tree_sha: "main",
      }
    );
    return result.data.tree
      .filter((data: any) => data.path.includes(flavor.repositoryPath))
      .map((item: ItemRepository) => {
        item.repositoryPath = nativescriptTemplateRepository;
        return item;
      });
  }

  private addNativescriptConfigFile(
    items: ItemRepository[],
    projectDefinition: ProjectMetadata,
    flavor: Flavor
  ): ItemRepository[] {
    items.push({
      mode: "",
      path: flavor.repositoryPath + "/nativescript.config.ts",
      sha: "",
      size: 0,
      type: TypeItemRepository.BLOB,
      url: "",
      repositoryPath: nativescriptTemplateConfigRepository,
      file: `import { NativeScriptConfig } from '@nativescript/core';
export default {
  id: '${projectDefinition.package}',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  }
} as NativeScriptConfig;`.trim(),
    });
    return items;
  }

  private addWebpackOpenNativeFile(
    items: ItemRepository[],
    flavor: Flavor
  ): ItemRepository[] {
    items.push({
      mode: "",
      path: flavor.repositoryPath + "/webpack.config.js",
      sha: "",
      size: 0,
      type: TypeItemRepository.BLOB,
      url: "",
      repositoryPath: nativescriptTemplateConfigRepository,
      file: `const webpack = require("@nativescript/webpack");

module.exports = (env) => {
\twebpack.init(env);

\t// Learn how to customize:
\t// https://docs.nativescript.org/webpack
\twebpack.chainWebpack(config => {
\t\tconfig.resolve.alias.set('react-native', '@open-native/core');
\t});

\treturn webpack.resolveConfig();
};`.trim(),
    });
    return items;
  }

  private async downloadTreeFiles(
    treeRepository: ItemRepository[]
  ): Promise<ItemRepository[]> {
    for (const item of treeRepository.filter(
      (item) => item.type === TypeItemRepository.BLOB
    )) {
      const file = await fetch(
        `https://raw.githubusercontent.com/${item.repositoryPath.owner}/${item.repositoryPath.repo}/main/${item.path}`
      );

      item.file = await (BLOB_EXTENSIONS.includes(
        this.getFileExtension(item.path)
      )
        ? file.blob()
        : file.text());
    }

    return treeRepository;
  }

  private downloadUser(link: HTMLAnchorElement, zip: JSZip) {
    zip.generateAsync({ type: "base64" }).then(function (base64) {
      link.href = "data:application/zip;base64," + base64;
      link.click();
    });
  }

  private applyPluginsAndMetadata(
    files: ItemRepository[],
    flavor: Flavor,
    plugins: Plugin[],
    projectDefinition: ProjectMetadata
  ) {
    const packageFile = files.find((file) =>
      file.path
        .toLowerCase()
        .includes(flavor.repositoryPath.toLowerCase() + "/package.json")
    );
    if (packageFile && typeof packageFile.file === "string") {
      const packageJSON: PackageJSON = JSON.parse(packageFile.file);
      plugins.forEach((plugin) => {
        packageJSON.dependencies[plugin.package] = plugin.version;
      });
      packageJSON.name = projectDefinition.name;
      if (projectDefinition.description) {
        packageJSON.description = projectDefinition.description;
      }
      packageFile.file = JSON.stringify(packageJSON, null, "\t");
    }
  }
}
