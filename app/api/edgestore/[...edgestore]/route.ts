import { initEdgeStore } from "@edgestore/server";

// This is api handler, here we have used app since we are using app router
// you can use pages router as well
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";

type Context = {
  userId: string;
  userRole: "admin" | "user";
};

function createContext({ req }: CreateContextOptions): Context {
  // get the session from your auth provider
//   get the details of user from the session
  // const session = getSession(req);
  return {
    // This access control runs without any querires of database
    userId: "123",
    userRole: "user",
  };
}

// initiating the edge store builder
const es = initEdgeStore.context<Context>().create();

// crating router
// here we will configure our edgestore buckets
const edgeStoreRouter = es.router({

  myPublicImages: es
//   setting size limits for entire bucket or for server
    .imageBucket({
      maxSize: 1024 * 1024 * 1, // 1MB
    })
    // for know whether we have post or profile image
    .input(
      z.object({
        type: z.enum(["post", "profile"]),
      })
    )
    // e.g. /post/my-file.jpg
    .path(({ input }) => [{ type: input.type }]),

  myProtectedFiles: es
    .fileBucket()
    // e.g. /123/my-file.pdf => Here 123 is the user id
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        {
            // userid should be same as the owner in the path e.g => 123
          userId: { path: "owner" },
        },
        {
          userRole: { eq: "admin" },
        },
      ],
    }),
});

// creating handler
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

// export this for GET and POST request
export { handler as GET, handler as POST };

// export the router type which we will use to create the typesafe client in our frontend
export type EdgeStoreRouter = typeof edgeStoreRouter;