const doGqlReq = (query, variables) =>
  fetch("http://localhost:8080/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Query success:", data);
    })
    .catch((error) => {
      console.error("Query error:", error);
    });

const fetchAsBase64 = (url, cb) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = function () {
        cb(this.result);
      };
      reader.readAsDataURL(blob);
    });
};

const send = ({ linkUrl, pageUrl, srcUrl }) => {
  if (srcUrl) {
    console.log(`Fetching image ${srcUrl}`);
    fetchAsBase64(srcUrl, (dataUrl) => {
      console.log(`Sending imge ${srcUrl}`);
      doGqlReq(
        `
      mutation UploadPhoto($input: UploadPhotoInput!) {
        uploadPhoto(input: $input) {
          name
        }
      }
      `,
        {
          input: {
            b64data: dataUrl.substr(dataUrl.indexOf("base64,") + 7),
          },
        }
      );
    });
  } else if (linkUrl) {
    console.log(`Sending ${linkUrl}`);
    doGqlReq(
      `
    mutation DownloadPhoto($input: DownloadPhotoInput!) {
      downloadPhoto(input: $input) {
        name
      }
    }
    `,
      {
        input: {
          url: linkUrl,
          referrer: pageUrl,
        },
      }
    );
  }
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: "Send to Photowolf",
    contexts: ["image", "link"],
    onclick: send,
  });
});
