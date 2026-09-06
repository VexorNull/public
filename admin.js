import { db } from './firebase-config.js';
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Helper Function: File ko Base64 string me convert karne k liye
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// Form Submission (Direct to Firestore)
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
        alert("Image ya media file select karna zaroori hai!");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Processing & Saving...";

    let mediaUrl = "";

    try {
        if (type !== 'text' && file) {
            // Check file size (Firestore document limit 1MB hoti hai, isliye choti images rakhein)
            if (file.size > 800 * 1024) { 
                alert("File ka size kafi bara hai! Please 800KB se kam size ki image upload karein (sirf Database use hone ki waja se).");
                submitBtn.disabled = false;
                submitBtn.innerText = "Publish Story";
                return;
            }
            // File ko Base64 String banayein
            mediaUrl = await convertFileToBase64(file);
        }

        // Direct Firestore Database me save karein
        await addDoc(collection(db, "stories"), {
            author: author,
            type: type,
            text: text || "",
            bgColor: bgColor || "#075e54",
            mediaUrl: mediaUrl,
            views: 0,
            createdAt: Date.now()
        });

        alert("Story successfully Database me publish ho gayi!");
        storyForm.reset();
    } catch (err) {
        console.error(err);
        alert("Publishing fail hui: " + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Publish Story";
    }
});

// Manage Stories Section
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

        card.querySelector('.delete-btn').addEventListener('click', () => deleteStory(storyId));
        adminStoryList.appendChild(card);
    });
});

async function deleteStory(id) {
    const pin = prompt("Confirm Admin PIN to Delete Story:");
    if (pin !== ADMIN_PIN) {
        alert("Incorrect PIN!");
        return;
    }

    try {
        await deleteDoc(doc(db, "stories", id));
        alert("Story Database se delete kar di gayi hai!");
    } catch (err) {
        alert("Delete failed: " + err.message);
    }
}
