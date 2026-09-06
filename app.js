import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const statusTray = document.getElementById('statusTray');
const storyModal = document.getElementById('storyModal');
const storyContent = document.getElementById('storyContent');
const closeModal = document.getElementById('closeModal');

const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    statusTray.innerHTML = "";
    snapshot.docs.forEach(doc => {
        const story = doc.data();
        
        const item = document.createElement('div');
        item.className = 'status-item';
        item.innerHTML = `
            <div class="avatar-ring">
                <div class="avatar-inner">${story.author.charAt(0).toUpperCase()}</div>
            </div>
            <p>${story.author}</p>
        `;
        
        item.addEventListener('click', () => openStory(story));
        statusTray.appendChild(item);
    });
});

function openStory(story) {
    storyContent.innerHTML = "";
    
    if (story.type === 'text') {
        storyContent.innerHTML = `<div class="story-text-display">${story.text}</div>`;
    } else if (story.type === 'image') {
        storyContent.innerHTML = `
            <div>
                <img src="${story.mediaUrl}" />
                <p style="margin-top: 10px;">${story.text}</p>
            </div>`;
    } else if (story.type === 'video') {
        storyContent.innerHTML = `
            <div>
                <video src="${story.mediaUrl}" controls autoplay></video>
                <p style="margin-top: 10px;">${story.text}</p>
            </div>`;
    }
    
    storyModal.classList.add('active');
}

closeModal.addEventListener('click', () => {
    storyModal.classList.remove('active');
});
