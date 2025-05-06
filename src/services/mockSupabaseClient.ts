
// Mock service pour remplacer le client Supabase

interface SupabaseQueryBuilder<T> {
  select: (columns?: string) => SupabaseQueryBuilder<T>;
  eq: (column: string, value: any) => SupabaseQueryBuilder<T>;
  neq: (column: string, value: any) => SupabaseQueryBuilder<T>;
  order: (column: string, options?: { ascending?: boolean }) => SupabaseQueryBuilder<T>;
  limit: (count: number) => SupabaseQueryBuilder<T>;
  single: () => Promise<{ data: T | null; error: Error | null }>;
  maybeSingle: () => Promise<{ data: T | null; error: Error | null }>;
  then: (callback: any) => Promise<any>;
}

interface SupabaseStorageClient {
  from: (bucket: string) => {
    upload: (path: string, file: File) => Promise<{ data: any; error: Error | null }>;
    download: (path: string) => Promise<{ data: any; error: Error | null }>;
    getPublicUrl: (path: string) => { data: { publicUrl: string } };
    list: (path: string, options?: any) => Promise<{ data: any; error: Error | null }>;
    remove: (paths: string[]) => Promise<{ data: any; error: Error | null }>;
  };
}

interface SupabaseChannelBuilder {
  on: (event: string, config: any, callback: (payload: any) => void) => SupabaseChannelBuilder;
  subscribe: () => { unsubscribe: () => void };
}

const mockSupabase = {
  auth: {
    signUp: async ({ email, password, options }: any) => {
      console.log("Mock: signUp called", { email, password, options });
      return { data: { user: { id: "mock-user-id" } }, error: null };
    },
    signIn: async ({ email, password }: any) => {
      console.log("Mock: signIn called", { email, password });
      return { data: { user: { id: "mock-user-id", email } }, error: null };
    },
    signOut: async () => {
      console.log("Mock: signOut called");
      return { error: null };
    },
    resetPasswordForEmail: async (email: string, options?: any) => {
      console.log("Mock: resetPasswordForEmail called", { email, options });
      return { error: null };
    },
    updateUser: async (updates: any) => {
      console.log("Mock: updateUser called", updates);
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      console.log("Mock: onAuthStateChange subscription created");
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    getSession: async () => {
      console.log("Mock: getSession called");
      return { data: { session: null }, error: null };
    }
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        console.log(`Mock: Uploading to ${bucket}/${path}`, file);
        return { data: { path }, error: null };
      },
      download: async (path: string) => {
        console.log(`Mock: Downloading from ${bucket}/${path}`);
        return { data: new Blob(["mock content"]), error: null };
      },
      getPublicUrl: (path: string) => {
        return { data: { publicUrl: `https://mock-storage.example.com/${bucket}/${path}` } };
      },
      list: async (path: string, options?: any) => {
        console.log(`Mock: Listing ${bucket}/${path}`, options);
        return { data: [], error: null };
      },
      remove: async (paths: string[]) => {
        console.log(`Mock: Removing from ${bucket}`, paths);
        return { data: { paths }, error: null };
      }
    })
  },
  from: <T>(table: string): SupabaseQueryBuilder<T> => {
    console.log(`Mock: Creating query for table ${table}`);
    return {
      select: (columns?: string) => {
        console.log(`Mock: Selecting columns ${columns} from ${table}`);
        return mockSupabase.from<T>(table);
      },
      eq: (column: string, value: any) => {
        console.log(`Mock: Filter ${column} = ${value} on ${table}`);
        return mockSupabase.from<T>(table);
      },
      neq: (column: string, value: any) => {
        console.log(`Mock: Filter ${column} != ${value} on ${table}`);
        return mockSupabase.from<T>(table);
      },
      order: (column: string, options?: { ascending?: boolean }) => {
        console.log(`Mock: Order by ${column} on ${table}`, options);
        return mockSupabase.from<T>(table);
      },
      limit: (count: number) => {
        console.log(`Mock: Limit ${count} on ${table}`);
        return mockSupabase.from<T>(table);
      },
      single: async () => {
        console.log(`Mock: Execute single query on ${table}`);
        return { data: null, error: null };
      },
      maybeSingle: async () => {
        console.log(`Mock: Execute maybeSingle query on ${table}`);
        return { data: null, error: null };
      },
      then: (callback: any) => {
        console.log(`Mock: Execute query on ${table} with then`);
        return Promise.resolve(callback({ data: [], error: null }));
      }
    };
  },
  rpc: (procedure: string, params: any) => {
    console.log(`Mock: Calling RPC ${procedure}`, params);
    return Promise.resolve({ data: [], error: null });
  },
  channel: (channel: string): SupabaseChannelBuilder => {
    console.log(`Mock: Creating channel ${channel}`);
    return {
      on: (event: string, config: any, callback: (payload: any) => void) => {
        console.log(`Mock: Subscribing to ${event} on channel ${channel}`, config);
        return mockSupabase.channel(channel);
      },
      subscribe: () => {
        console.log(`Mock: Subscribing to channel ${channel}`);
        return { unsubscribe: () => {} };
      }
    };
  },
  removeChannel: (channel: any) => {
    console.log(`Mock: Removing channel`, channel);
  },
  functions: {
    invoke: async (name: string, options?: any) => {
      console.log(`Mock: Invoking function ${name}`, options);
      return { data: null, error: null };
    }
  }
};

export const supabase = mockSupabase;
export const extendedSupabase = mockSupabase;
