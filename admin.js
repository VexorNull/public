import { db, storage } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const contentType = document.getElementById('contentType');
const textGroup = document.getElementById('textInputGroup');
const fileGroup = document.getElementById('fileInputGroup');
const storyForm = document.getElementById('storyForm');
const submitBtn = document.getElementById('submitBtn');

contentType.addEventListener('change', (e) => {
    if (e.target.value === 'text') {
        textGroup.classList.remove('hidden');
        fileGroup.classList.add('hidden');
    } else {
        textGroup.classList.remove('hidden'); // Caption ke liye optional text field
        fileGroup.classList.remove('hidden');
    }
});

storyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = contentType.value;
    const author = document.getElementById('authorName').value;
    const text = document.getElementById('storyText').value;
    const fileInput = document.getElementById('mediaFile');
    const file = fileInput.files[0];

    if (type !== 'text' && !file) {
        alert("Khabardar: Image ya Video file select karna zaroori hai!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Uploading...";

    let mediaUrl = "";

    try {
        if (type !== 'text' && file) {
            const storageRef = ref(storage, `stories/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            mediaUrl = await getDownloadURL(snapshot.ref);
        }

        await addDoc(collection(db, "stories"), {
            author: author,
            type: type,
            text: text || "",
            mediaUrl: mediaUrl,
            createdAt: serverTimestamp()
        });

        alert("Story successfully publish ho gayi hai!");
        storyForm.reset();
        window.location.href = "index.html";
    } catch (err) {
        console.error("Error adding story: ", err);
        alert("Upload fail hua: " + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Publish Story";
    }
});
