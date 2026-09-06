import { db, storage } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const contentType = document.getElementById('contentType');
const textGroup = document.getElementById('textInputGroup');
const fileGroup = document.getElementById('fileInputGroup');
const storyForm = document.getElementById('storyForm');

contentType.addEventListener('change', (e) => {
    if (e.target.value === 'text') {
        textGroup.classList.remove('hidden');
        fileGroup.classList.add('hidden');
    } else {
        fileGroup.classList.remove('hidden');
    }
});

storyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = contentType.value;
    const author = document.getElementById('authorName').value;
    const text = document.getElementById('storyText').value;
    const file = document.getElementById('mediaFile').files[0];

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
            text: text,
            mediaUrl: mediaUrl,
            createdAt: serverTimestamp()
        });

        alert("Story Posted Successfully!");
        storyForm.reset();
        window.location.href = "index.html";
    } catch (err) {
        console.error("Error adding document: ", err);
        alert("Upload Failed: " + err.message);
    }
});
