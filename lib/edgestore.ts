"use client";

import { type EdgeStoreRouter } from "@/app/api/edgestore/[...edgestore]/route";
import { createEdgeStoreProvider } from "@edgestore/react";

// Here we will use the EdgeStoreRouter type whcih you exported from API route to create the Context Provider(EdgeStoreProvider) and the hook(useEdgeStore) to use the edgestore in our frontend
export const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    maxConcurrentUploads: 2,
  });