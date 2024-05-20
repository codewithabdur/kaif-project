import SanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const client = SanityClient({
  projectId: "v6rjvkct",
  dataset: "production",
  apiVersion: "2024-02-01",
  useCdn: false,
});

export default client;
const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
