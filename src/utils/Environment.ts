export enum Env {
  Dev = "local",
  Stage = "stage",
  Production = "production",
}

export const getEnv = () => {
  return import.meta.env.VITE_APP_ENVIRONMENT;
};
export const isDev = () => {
  return import.meta.env.VITE_APP_ENVIRONMENT === Env.Dev;
};
export const isTest = () => {
  return import.meta.env.VITE_APP_ENVIRONMENT === Env.Stage;
};
export const isProduction = () => {
  return import.meta.env.VITE_APP_ENVIRONMENT === Env.Production;
};
