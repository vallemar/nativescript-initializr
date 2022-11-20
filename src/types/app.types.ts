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

export type Plugin = {
  name: string;
  version: string;
  description: string;
  date: string;
  links: {
    npm: string;
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
};
