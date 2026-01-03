import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Supabase Configuration", () => {
  let supabase: ReturnType<typeof createClient>;

  beforeAll(() => {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    expect(url).toBeDefined();
    expect(key).toBeDefined();

    supabase = createClient(url!, key!);
  });

  it("should connect to Supabase with valid credentials", async () => {
    // Test basic connectivity by checking auth status
    const { data, error } = await supabase.auth.getSession();
    
    // We expect no error even if not authenticated
    // This validates that the credentials are correct and Supabase is reachable
    expect(error).toBeNull();
  });

  it("should have access to fighters table", async () => {
    // Test that we can query the fighters table (even if empty)
    const { data, error } = await supabase
      .from("fighters")
      .select("id")
      .limit(1);

    // Should not error - table should exist
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it("should have access to challenges table", async () => {
    // Test that we can query the challenges table
    const { data, error } = await supabase
      .from("challenges")
      .select("id")
      .limit(1);

    // Should not error - table should exist
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
