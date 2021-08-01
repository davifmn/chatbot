import express from "express";
import { Octokit } from "@octokit/rest";
import cors from "cors";

const app = express();
const port = 3000;
const octokit = new Octokit();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.options("*", cors());

// https://localhost:3000/list-repos
app.get("/list-repos", async (_, res) => {
  // Compare: https://docs.github.com/en/rest/reference/repos/#list-organization-repositories
  const response = await octokit.rest.repos.listForOrg({
    org: "takenet",
    type: "public",
  });
  const reposList = response.data;
  const reposListFiltered = reposList.filter((item) => item.language === "C#");
  const reposListSorted = reposListFiltered
    .sort((a, b) => a.created_at < b.created_at)
    .slice(0, 5);
  const responseObj = {
    itemType: "application/vnd.lime.document-select+json",
    items: reposListSorted.map((item) => ({
      header: {
        type: "application/vnd.lime.media-link+json",
        value: {
          title: item.name,
          text: item.description,
          type: "image/jpeg",
          uri: item.owner.avatar_url,
        },
      },
    })),
  };

  res.json(responseObj);
});

app.listen(process.env.PORT || port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);