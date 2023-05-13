
export declare module './vite-plugin-dominion-content' {
  const DominionContentPlugin: () => {
    name: string;
    generateBundle: (options: any, bundle: any) => Promise<void>;
  };
  export default DominionContentPlugin;
}

