const save = () => {
  const url = document.getElementById("url").value;
  chrome.storage.sync.set(
    {
      photowolfUrl: url,
    },
    () => {
      const status = document.getElementById("status");
      status.textContent = "Saved";
      setTimeout(() => {
        status.textContent = "";
      }, 1000);
    }
  );
};

const restore = () => {
  chrome.storage.sync.get(
    {
      photowolfUrl: "http://localhost:8080/graphql",
    },
    ({ photowolfUrl }) => {
      document.getElementById("url").value = photowolfUrl;
    }
  );
};

document.addEventListener("DOMContentLoaded", restore);
document.getElementById("save").addEventListener("click", save);
