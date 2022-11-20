export type Flavor = {
  text: string;
  selected: boolean;
  repositoryURL: string;
  repositoryPath: string;
  img?: string;
};

export type ProjectMetadata = {
  name: string;
  description?: string;
  package?: string;
};

export enum TypePlugin {
  NS,
  RN,
}

export type Plugin = {
  name: string;
  version: string;
  package: string;
  description: string;
  date: string;
  links: {
    npm?: string;
    repository: string;
  };
  downloadStats: {
    lastDay: number;
    lastWeek: number;
    lastMonth: number;
  };
  author: {
    name: string;
    username: string;
  };
  type: TypePlugin;
};

export interface UrlsRN {
  repo: string;
  clone: string;
}

export interface LastReleaseRN {
  name: string;
  tagName: string;
  createdAt: Date;
  publishedAt: Date;
  isPrerelease: boolean;
}
export interface StatsRN {
  hasIssues: boolean;
  hasWiki: boolean;
  hasPages: boolean;
  hasDownloads: boolean;
  hasTopics: boolean;
  updatedAt: string;
  createdAt: Date;
  pushedAt: Date;
  forks: number;
  issues: number;
  subscribers: number;
  stars: number;
}

export interface GithubRN {
  urls: UrlsRN;
  stats: StatsRN;
  name: string;
  fullName: string;
  description: string;
  topics: string[];
  hasTypes: boolean;
  newArchitecture: boolean;
  lastRelease?: LastReleaseRN;
}

export interface NpmRN {
  downloads: number;
  weekDownloads: number;
  start: string;
  end: string;
  period: string;
}

export interface RequestReactNativePluginDTO {
  libraries: ReactNativePlugin[];
  total: number;
}
export interface ReactNativePlugin {
  githubUrl: string;
  npmPkg: string;
  ios: boolean;
  android: boolean;
  github: GithubRN;
  images: any[];
  npm: NpmRN;
  score: number;
  matchingScoreModifiers: string[];
  popularity: number;
  topicSearchString: string;
  matchScore: number;
  type: TypePlugin;
}
