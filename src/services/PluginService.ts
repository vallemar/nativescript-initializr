export const pluginService = {
  async findAll() {
    return (
      await fetch("https://market.nativescript.org/api/plugins.json")
    ).json();
  },
};
