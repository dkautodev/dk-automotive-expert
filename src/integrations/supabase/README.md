
# Supabase Integration

This folder contains files related to the Supabase integration.

## Type Generation

The TypeScript types in `types.ts` need to be updated whenever the database schema changes.
Since this file is marked as read-only in this project, we've created a temporary solution:

1. We've created an extended client in `extended-client.ts` that casts the regular client to include our new tables
2. We've created utility types in `supabase-extended.ts` to define the new tables
3. We've provided a helper script in `scripts/generate-supabase-types.js` 

To properly update the types in the future, you can:

1. Run `node scripts/generate-supabase-types.js` to generate the latest types
2. Update `src/integrations/supabase/types.ts` with the generated content

## Temporary Solution

If you need to access tables that aren't yet in the TypeScript types, you can:

1. Use the `extendedSupabase` client from `extended-client.ts`
2. Or use the `safeTable` function from `utils/supabase-helper.ts`

```typescript
import { safeTable } from "@/utils/supabase-helper";

// Example usage
const { data, error } = await safeTable('your_new_table').select('*');
```

This is a temporary solution until the types can be properly updated.
