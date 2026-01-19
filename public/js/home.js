function toggleSidebar() {
  document.getElementById("mobileSidebar").classList.toggle("hidden");
}

function openUpload() {
  const mobileSidebar = document.getElementById("mobileSidebar");
  if (mobileSidebar && !mobileSidebar.classList.contains("hidden")) {
    mobileSidebar.classList.add("hidden");
  }

  document.getElementById("uploadModal").classList.remove("hidden");
}

function closeUpload() {
  resetUploadUI();
  isUploading = false;

  const btn = document.getElementById("uploadBtn");
  btn.disabled = false;
  btn.textContent = "Upload";
  btn.classList.remove("bg-gray-500");

  document.getElementById("uploadModal").classList.add("hidden");
}

let isUploading = false;

function handleUpload() {
  if (isUploading) {
    return false;
  }

  isUploading = true;

  const btn = document.getElementById("uploadBtn");
  btn.disabled = true;
  btn.textContent = "Uploading...";
  btn.classList.add("bg-gray-500");

  return true;
}

function setView(view) {
  const list = document.getElementById("listView");
  const grid = document.getElementById("gridView");

  if (view === "grid") {
    list.classList.add("hidden");
    grid.classList.remove("hidden");
    localStorage.setItem("driveView", "grid");
  } else {
    grid.classList.add("hidden");
    list.classList.remove("hidden");
    localStorage.setItem("driveView", "list");
  }
}
let currentView = "grid"; // default

function toggleView() {
  const grid = document.getElementById("gridView");
  const list = document.getElementById("listView");
  const icon = document.getElementById("viewToggleIcon");

  if (currentView === "grid") {
    grid.classList.add("hidden");
    list.classList.remove("hidden");
    icon.className = "ri-grid-fill";
    currentView = "list";
  } else {
    list.classList.add("hidden");
    grid.classList.remove("hidden");
    icon.className = "ri-list-check";
    currentView = "grid";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedView = localStorage.getItem("driveView") || "list";
  setView(savedView);
});

function fileSelected(input) {
  const file = input.files[0];

  const fileName = document.getElementById("fileName");
  const uploadText = document.getElementById("uploadText");
  const uploadIcon = document.getElementById("uploadIcon");

  // remove old error
  const oldError = document.getElementById("uploadError");
  if (oldError) oldError.remove();

  if (!file) return;

  // allowed image types
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  // INVALID FILE TYPE
  if (!allowedTypes.includes(file.type)) {
    showUploadError("Only image files are allowed (jpg, png, gif, webp)");

    input.value = ""; // VERY IMPORTANT
    return;
  }

  // FILE TOO LARGE (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showUploadError("Image size must be less than 5MB");

    input.value = "";
    return;
  }

  // VALID FILE
  fileName.textContent = file.name;
  fileName.classList.remove("hidden");

  uploadText.textContent = "File selected";
  uploadIcon.className = "ri-check-line text-4xl text-green-400";

  if (!allowedTypes.includes(file.type)) {
    showUploadError("Only image files are allowed");

    resetUploadUI();
    input.value = "";
    return;
  }
}

function showUploadError(message) {
  const form = document.querySelector("#uploadModal form");

  const error = document.createElement("p");
  error.id = "uploadError";
  error.className = "text-red-400 text-sm text-center";
  error.textContent = message;

  form.insertBefore(error, form.lastElementChild);
}

function resetUploadUI() {
  document.getElementById("fileInput").value = "";
  document.getElementById("fileName").classList.add("hidden");
  document.getElementById("fileName").textContent = "";

  document.getElementById("uploadText").textContent = "Click to upload";
  document.getElementById("uploadIcon").className =
    "ri-upload-cloud-2-line text-4xl mb-2";

  const error = document.getElementById("uploadError");
  if (error) error.remove();
}

function filterFiles(query) {
  query = query.toLowerCase();
  const rows = document.querySelectorAll(".file-row");

  rows.forEach((row) => {
    const name = row.dataset.name;

    if (name.includes(query)) {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
}

function toggleProfileMenu() {
  const menu = document.getElementById("profileMenu");
  menu.classList.toggle("hidden");
}

// Optional: click outside to close
document.addEventListener("click", function (e) {
  const menu = document.getElementById("profileMenu");
  if (!e.target.closest(".relative")) {
    menu.classList.add("hidden");
  }
});

// function openFile(url) {
//   // const viewerUrl =
//   //   "https://docs.google.com/gview?url=" +
//   //   encodeURIComponent(url) +
//   //   "&embedded=true";
//   const newWindow = window.open(url, "_blank");
//   if (newWindow) {
//     console.log("OPENING URL:", url);
//     newWindow.opener = null;
//   }
// }

function toggleOptions(id) {
  // close all other dropdowns
  document.querySelectorAll("[id^='options_']").forEach((menu) => {
    if (menu.id !== "options_" + id) {
      menu.classList.add("hidden");
    }
  });

  const menu = document.getElementById("options_" + id);
  menu.classList.toggle("hidden");
}

// close dropdown on outside click
document.addEventListener("click", function () {
  document.querySelectorAll("[id^='options_']").forEach((menu) => {
    menu.classList.add("hidden");
  });
});

const params = new URLSearchParams(window.location.search);

if (params.has("success")) {
  Swal.fire({
    toast: true,
    position: "top-right",
    icon: "success",
    title: params.get("success"),
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
}

if (params.has("error")) {
  Swal.fire({
    toast: true,
    position: "top-right",
    icon: "error",
    title: params.get("error"),
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
}

window.history.replaceState({}, document.title, window.location.pathname);

function openRename(id, currentName) {
  event.stopPropagation();

  document.getElementById("renameModal").classList.remove("hidden");
  document.getElementById("renameInput").value = currentName;

  const form = document.getElementById("renameForm");
  form.action = `/file/rename/${id}`;
}

function closeRename() {
  document.getElementById("renameModal").classList.add("hidden");
}

function confirmDelete(e, fileId) {
  e.preventDefault();

  Swal.fire({
    title: "Delete file?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/file/delete/${fileId}`;
      document.body.appendChild(form);
      form.submit();
    }
  });

  return false;
}


function openFile(url, type) {
  // IMAGE
  console.log("OPEN FILE:", url, type);

  if (type.startsWith("image/")) {
    openImagePreview(url);
    return;
  }
}

function openImagePreview(url) {
  console.log("IMAGE PREVIEW URL:", url);
  const modal = document.getElementById("previewModal");
  const img = document.getElementById("imagePreview");

  img.src = url;
  img.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function closePreview() {
  const modal = document.getElementById("previewModal");
  const img = document.getElementById("imagePreview");

  img.src = "";
  img.classList.add("hidden");
  modal.classList.add("hidden");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePreview();
});

function downloadFile(url, filename) {
    const downloadUrl = url.replace(
    "/upload/",
    "/upload/fl_attachment/"
  );
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
