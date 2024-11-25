const config = {
  manifestUrl: import.meta.env.DEV
    ? "/manifest.json" // Local development path
    : "/ludoteca/manifest.json", // Production path
};

export default config;
