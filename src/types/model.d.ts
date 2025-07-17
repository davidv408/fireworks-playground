interface ApiResponeModel {
  name: string;
  title: string;
  description: string;
  provider: {
    name: string;
    hf: string;
    accountId?: string;
    org: {
      name: string;
      logos: {
        logomark: {
          src: string;
        };
        combomark?: {
          src: string;
        };
      };
    };
  };
  type: string;
  serverless: boolean;
  contextLength: number;
  supportsImageInput: boolean;
  tags: string[];
  cost: {
    inputTokenPrice: number;
    outputTokenPrice: number;
    tokenPrice: number;
  };
}
