
import { supabase } from './client';

// Create a wrapped version of supabase client with mock functionality
// This will help us avoid errors when database tables don't exist
export const extendedSupabase = {
  ...supabase,
  from: (table: string) => {
    console.log(`Mock database operation on table: ${table}`);
    
    return {
      select: (columns: string = '*') => {
        console.log(`Mock SELECT ${columns} FROM ${table}`);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock WHERE ${column} = ${value}`);
            return {
              single: () => Promise.resolve({ data: null, error: null }),
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
              order: () => ({
                limit: () => Promise.resolve({ data: [], error: null }),
                range: () => Promise.resolve({ data: [], error: null }),
              }),
              limit: () => Promise.resolve({ data: [], error: null }),
              data: null,
              error: null
            };
          },
          neq: () => ({
            data: null,
            error: null
          }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
            range: () => Promise.resolve({ data: [], error: null }),
          }),
          in: () => ({
            data: null,
            error: null
          })
        };
      },
      insert: (values: any) => {
        console.log(`Mock INSERT INTO ${table}`, values);
        return Promise.resolve({ data: values, error: null });
      },
      update: (values: any) => {
        console.log(`Mock UPDATE ${table}`, values);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock WHERE ${column} = ${value}`);
            return Promise.resolve({ data: values, error: null });
          },
          match: (criteria: any) => {
            console.log(`Mock WHERE criteria match`, criteria);
            return Promise.resolve({ data: values, error: null });
          }
        };
      },
      delete: () => {
        console.log(`Mock DELETE FROM ${table}`);
        return {
          eq: (column: string, value: any) => {
            console.log(`Mock WHERE ${column} = ${value}`);
            return Promise.resolve({ data: null, error: null });
          }
        };
      },
      upsert: (values: any) => {
        console.log(`Mock UPSERT INTO ${table}`, values);
        return Promise.resolve({ data: values, error: null });
      }
    };
  },
  storage: {
    ...supabase.storage,
    from: (bucket: string) => {
      console.log(`Mock storage operation on bucket: ${bucket}`);
      return {
        upload: (path: string, file: File) => {
          console.log(`Mock upload to ${bucket}/${path}`);
          return Promise.resolve({ 
            data: { path: `${bucket}/${path}` }, 
            error: null 
          });
        },
        getPublicUrl: (path: string) => {
          console.log(`Mock get public URL for ${bucket}/${path}`);
          return { 
            data: { publicUrl: `https://example.com/${bucket}/${path}` } 
          };
        },
        list: (folder: string) => {
          console.log(`Mock list files in ${bucket}/${folder}`);
          return Promise.resolve({ 
            data: [], 
            error: null 
          });
        },
        remove: (paths: string[]) => {
          console.log(`Mock remove files: ${paths.join(', ')}`);
          return Promise.resolve({ 
            data: null, 
            error: null 
          });
        }
      };
    }
  }
};
