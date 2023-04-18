
export declare module './dominion-content-plugin' {
  const DominionContentPlugin: () => {
    name: string;
    generateBundle: (options: any, bundle: any) => Promise<void>;
  };
  export default DominionContentPlugin;
}

