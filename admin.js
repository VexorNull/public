import { db, storage } from './firebase-config.js';
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const contentType = document.getElementById('contentType');
const textGroup = document.getElementById('textInputGroup');
const fileGroup = document.getElementById('fileInputGroup');
const bgColorGroup = document.getElementById('bgColorGroup');
const storyForm = document.getElementById('storyForm');
const submitBtn = document.getElementById('submitBtn');
const adminStoryList = document.getElementById('adminStoryList');

const ADMIN_PIN = "7070"; 

contentType.addEventListener('change', (e) => {
    if (e.target.value === 'text') {
        textGroup.classList.remove('hidden');
        bgColorGroup.classList.remove('hidden');
        fileGroup.classList.add('hidden');
    } else {
        textGroup.classList.remove('hidden');
        bgColorGroup.classList.add('hidden');
        fileGroup.classList.remove('hidden');
    }
});

// Form Submission
storyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const pin = document.getElementById('adminPin').value;
    if (pin !== ADMIN_PIN) {
        alert("Ghalat Admin PIN!");
        return;
    }

    const type = contentType.value;
    const author = document.getElementById('authorName').value;
    const text = document.getElementById('storyText').value;
    const bgColor = document.getElementById('bgColor').value;
    const file = document.getElementById('mediaFile').files[0];

    if (type !== 'text' && !file) {
        alert("Image ya video file select karna zaroori hai!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Publishing...";

    let mediaUrl = "";
    let storagePath = "";

    try {
        if (type !== 'text' && file) {
            storagePath = `stories/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            const snapshot = await uploadBytes(storageRef, file);
            mediaUrl = await getDownloadURL(snapshot.ref);
        }

        await addDoc(collection(db, "stories"), {
            author: author,
            type: type,
            text: text || "",
            bgColor: bgColor || "#075e54",
            mediaUrl: mediaUrl,
            storagePath: storagePath,
            views: 0,
            createdAt: Date.now()
        });

        alert("Story successfully publish ho gayi!");
        storyForm.reset();
    } catch (err) {
        console.error(err);
        alert("Upload fail hua: " + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Publish Story";
    }
});

// Fetch & Delete Stories Panel
const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    adminStoryList.innerHTML = "";
    snapshot.docs.forEach(docSnap => {
        const story = docSnap.data();
        const storyId = docSnap.id;

        const card = document.createElement('div');
        card.className = 'admin-story-card';
        card.innerHTML = `
            <div>
                <strong>${story.author}</strong> (${story.type.toUpperCase()})
                <p class="small-text">${story.text ? story.text.substring(0, 30) + '...' : 'No Text'}</p>
            </div>
            <button class="delete-btn" data-id="${storyId}">Delete</button>
        `;

        card.querySelector('.delete-btn').addEventListener('click', () => deleteStory(storyId, story.storagePath));
        adminStoryList.appendChild(card);
    });
});

async function deleteStory(id, storagePath) {
    const pin = prompt("Confirm Admin PIN to Delete Story:");
    if (pin !== ADMIN_PIN) {
        alert("Incorrect PIN!");
        return;
    }

    try {
        await deleteDoc(doc(db, "stories", id));

        if (storagePath) {
            const fileRef = ref(storage, storagePath);
            await deleteObject(fileRef).catch(e => console.log("Storage file cleanup:", e));
        }

        alert("Story successfully delete kar di gayi hai!");
    } catch (err) {
        alert("Delete failed: " + err.message);
    }
}
