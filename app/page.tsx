"use client";

import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  // to access the file that we created
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [urls, setUrls] = useState<{
    url: string;
    thumbnailUrl: string | null;
  }>();

  // grabbing the edgestroe client from EdgeStore Hook
  const { edgestore } = useEdgeStore();

  return (
    <div className="flex flex-col items-center m-6 gap-2">
      <SingleImageDropzone
        width={200}
        height={200}
        value={file}
        // setting size limits to the image to be uploaded
        // but this is just frontend validation, the backend will also validate the size
        // and only for this specific input 
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1, // 1MB
        }}
        onChange={(file) => {
          setFile(file);
        }}
      />

{/* Designing Progress Bar */}
{/* Firstly we will design outer bar */}
      <div className="h-[6px] w-44 border rounded overflow-hidden">
        //Inner Progress bar
        <div
          className="h-full bg-white transition-all duration-150"
          style={{
            //linking to the progress state
            width: `${progress}%`,
          }}
        />
      </div>
      <button
        className="bg-white text-black rounded px-2 hover:opacity-80"
        onClick={
          // Here we will add function to upload the file to edgestore
          async () => {
          if (file) {
            // use the edgestore client to call the upload function of our Public Image bucket
            // image create a thumbnail url if it gets bigger than a certain size
            const res = await edgestore.myPublicImages.upload({
              file,
              input: { type: "post" },
              // for showing the progress
              onProgressChange: (progress) => {
                setProgress(progress);
              },
            });
            // save your data here
            setUrls({
              url: res.url,
              thumbnailUrl: res.thumbnailUrl,
            });
          }
        }}
      >
        Upload
      </button>
      {urls?.url && (
        <Link href={urls.url} target="_blank">
          URL
        </Link>
      )}
      {urls?.thumbnailUrl && (
        <Link href={urls.thumbnailUrl} target="_blank">
          THUMBNAIL
        </Link>
      )}
    </div>
  );
}