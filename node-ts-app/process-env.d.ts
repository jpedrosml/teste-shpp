declare namespace global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        PORT: string;
        GEMINI_API_KEY: string;
        // add more environment variables and their types here
      }
    }
  }