import { Flavor, Plugin, ProjectMetadata } from "@/types/app.types";
const NS_REPOSITORY =
  "https://github.com/NativeScript/nativescript-app-templates";
//TODO: download imgs
export const FLAVORS: Flavor[] = [
  {
    text: "JS",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/490px-Unofficial_JavaScript_logo_2.svg.png",
    selected: false,
    repositoryURL: NS_REPOSITORY,
    repositoryPath: "packages/template-blank",
  },
  {
    text: "TS",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/600px-Typescript_logo_2020.svg.png",
    selected: true,
    repositoryURL: NS_REPOSITORY,
    repositoryPath: "packages/template-blank-ts",
  },
  {
    text: "Angular",
    img: "https://angular.io/assets/images/logos/angular/angular.svg",
    selected: false,
    repositoryURL: NS_REPOSITORY,
    repositoryPath: "packages/template-blank-ng",
  },
  {
    text: "Vue",
    img: "/img/logo-vue.svg",
    selected: false,
    repositoryURL: NS_REPOSITORY,
    repositoryPath: "packages/template-blank-vue-ts",
  },
  {
    text: "Svelte",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/500px-Svelte_Logo.svg.png",
    selected: false,
    repositoryURL: NS_REPOSITORY,
    repositoryPath: "packages/template-blank-svelte",
  },
  {
    text: "React",
    img: "/img/logo-react.svg",
    selected: false,
    repositoryURL: NS_REPOSITORY,
    repositoryPath: "packages/template-blank-react",
  },
];

export const PROJECT_DEFINITION: ProjectMetadata = {
  name: "demo",
  description: "Description",
  package: "com.nativescript.demo",
};
